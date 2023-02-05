import type { FC, MouseEventHandler } from "react";
import React from "react";
import type { FoodItem } from "@prisma/client";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonText,
} from "@ionic/react";
import { snowOutline, sparklesOutline, trashOutline } from "ionicons/icons";
import { getExpirationStatusColor, getExpirationText } from "../../utils/date";

const ItemRenderer: FC<{
  foodItem: FoodItem;
  onClick: MouseEventHandler;
  onMove: (destination: "fridge" | "pantry") => void;
  onDelete: (itemId: string) => void;
}> = ({ foodItem, onClick, onMove, onDelete }) => {
  const moveItemConfig =
    foodItem.container === "fridge"
      ? { color: "warning", icon: sparklesOutline, destination: "pantry" }
      : { color: "secondary", icon: snowOutline, destination: "fridge" };

  return (
    <IonItemSliding key={foodItem.id}>
      <IonItemOptions side="end">
        <IonItemOption color={moveItemConfig.color}>
          <IonIcon
            slot="icon-only"
            icon={moveItemConfig.icon}
            onClick={() =>
              onMove(moveItemConfig.destination as "fridge" | "pantry")
            }
          />
        </IonItemOption>
        <IonItemOption color="danger" onClick={() => onDelete(foodItem.id)}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
      <IonItem button onClick={onClick}>
        <IonLabel>{foodItem.name}</IonLabel>
        <IonText color={getExpirationStatusColor(foodItem.expirationDate)}>
          {getExpirationText(foodItem.expirationDate)}
        </IonText>
      </IonItem>
    </IonItemSliding>
  );
};

export default ItemRenderer;
