import type { FC, MouseEventHandler } from "react";
import React from "react";
import type { FoodItem } from "@prisma/client";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import {
  getExpirationStatusColor,
  getExpirationText,
} from "../../../utils/date";

const FoodItemRenderer: FC<{
  foodItem: FoodItem;
  onClick: MouseEventHandler;
}> = ({ foodItem, onClick }) => {
  return (
    <IonItem button onClick={onClick}>
      <IonLabel>{foodItem.name}</IonLabel>
      <IonText color={getExpirationStatusColor(foodItem.expirationDate)}>
        {getExpirationText(foodItem.expirationDate)}
      </IonText>
    </IonItem>
  );
};

export default FoodItemRenderer;
