import type { FC } from "react";
import React, { useCallback } from "react";
import type { FridgeItem } from "@prisma/client";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonText,
  useIonToast,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { api } from "../../utils/api";

const ItemRenderer: FC<{ fridgeItem: FridgeItem }> = ({ fridgeItem }) => {
  const [presentToast] = useIonToast();
  const util = api.useContext();

  const createFridgeItemMutation = api.fridge.addItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
    },
  });

  const deleteFridgeItemMutation = api.fridge.deleteItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
      await presentToast({
        message: `${fridgeItem.name} was thrown out`,
        buttons: [
          {
            text: "Undo",
            handler: () => {
              createFridgeItemMutation.mutate({
                name: fridgeItem.name,
                expirationDate: fridgeItem.expirationDate,
              });
            },
          },
        ],
        duration: 5000,
      });
    },
  });

  const deleteFridgeItem = useCallback(() => {
    deleteFridgeItemMutation.mutate({ itemId: fridgeItem.id });
  }, [deleteFridgeItemMutation, fridgeItem]);

  return (
    <IonItemSliding key={fridgeItem.id}>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteFridgeItem}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
      <IonItem>
        <IonLabel>{fridgeItem.name}</IonLabel>
        <IonText>
          expires on {fridgeItem.expirationDate.toLocaleDateString()}
        </IonText>
      </IonItem>
    </IonItemSliding>
  );
};

export default ItemRenderer;
