import type { FC, MouseEventHandler } from "react";
import React from "react";
import type { FridgeItem } from "@prisma/client";
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
  fridgeItem: FridgeItem;
  onClick: MouseEventHandler;
  onMove: (destination: "fridge" | "pantry") => void;
  onDelete: (itemId: string) => void;
}> = ({ fridgeItem, onClick, onMove, onDelete }) => {
  const moveItemConfig =
    fridgeItem.container === "fridge"
      ? { color: "warning", icon: sparklesOutline, destination: "pantry" }
      : { color: "secondary", icon: snowOutline, destination: "fridge" };

  return (
    <IonItemSliding key={fridgeItem.id}>
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
        <IonItemOption color="danger" onClick={() => onDelete(fridgeItem.id)}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
      <IonItem button onClick={onClick}>
        <IonLabel>{fridgeItem.name}</IonLabel>
        <IonText color={getExpirationStatusColor(fridgeItem.expirationDate)}>
          {getExpirationText(fridgeItem.expirationDate)}
        </IonText>
      </IonItem>
    </IonItemSliding>
  );
};

export default ItemRenderer;
