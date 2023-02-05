import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";
import * as nodemailer from "nodemailer";
import type { FoodItem } from "@prisma/client";
import { prisma } from "../../server/db";

function getFoodItemsHtmlTable(foodItems: FoodItem[]) {
  1;
  if (foodItems.length === 0) {
    return "<p>No items expiring soon</p>";
  }

  const tableRows = foodItems.map((item) => {
    return `<tr><td>${
      item.name
    }</td><td>${item.expirationDate.toLocaleDateString()}</td></tr>`;
  });

  return `<table style="text-align: left; border-spacing: 8px"><tr><th>Item</th><th>Expiration date</th></tr>${tableRows.join(
    ""
  )}</table>`;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${env.API_SECRET_KEY}`) {
        const transporter = nodemailer.createTransport(env.EMAIL_SERVER);
        const date = new Date();
        const expiringSoonDate = new Date(date.setDate(date.getDate() + 3));

        const usersToNotify = await prisma.user.findMany({
          where: {
            notificationsEnabled: true,
          },
        });

        let emailsSent = 0;
        for (const user of usersToNotify) {
          if (!user.email) continue;
          const foodItemsExpiringSoon = await prisma.foodItem.findMany({
            where: {
              user: {
                id: user.id,
              },
              expirationDate: {
                lte: expiringSoonDate,
              },
            },
          });

          if (foodItemsExpiringSoon.length > 0) {
            const fridgeItems = foodItemsExpiringSoon.filter(
              (item) => item.container === "fridge"
            );
            const pantryItems = foodItemsExpiringSoon.filter(
              (item) => item.container === "pantry"
            );

            await transporter.sendMail({
              from: env.EMAIL_FROM,
              to: user.email,
              subject: "What's in the Fridge - Daily Report",
              html: `<p>The following items may no longer be good to eat:</p><h3>Fridge</h3>${getFoodItemsHtmlTable(
                fridgeItems
              )}<h3>Pantry</h3>${getFoodItemsHtmlTable(pantryItems)}`,
            });

            emailsSent++;
          }
        }

        res.status(200).json({ emailsSent });
      } else {
        res.status(401).end("Unauthorized");
      }
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        message: err instanceof Error ? err.message : "Error",
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
