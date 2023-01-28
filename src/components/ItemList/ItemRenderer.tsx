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
import { trashOutline } from "ionicons/icons";
import { getExpirationStatusColor, getExpirationText } from "../../utils/date";

const ItemRenderer: FC<{
  fridgeItem: FridgeItem;
  onClick: MouseEventHandler;
  onDelete: (itemId: string) => void;
}> = ({ fridgeItem, onClick, onDelete }) => {
  return (
    <IonItemSliding key={fridgeItem.id}>
      <IonItemOptions side="end">
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
