import {
  IonButton,
  IonButtons,
  IonHeader,
  IonLoading,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { api } from "../../utils/api";
import ModifyItemForm from "./ModifyItemForm";
import type { FC, MouseEventHandler } from "react";
import React from "react";
import type { FridgeItem } from "@prisma/client";

const ModifyItemPage: FC<{
  fridgeItem?: FridgeItem;
  onCancel: MouseEventHandler;
  onSave: () => void;
}> = ({ fridgeItem, onCancel, onSave }) => {
  const util = api.useContext();

  const addItemMutation = api.fridge.addItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
    },
  });

  const updateItemMutation = api.fridge.updateItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
    },
  });

  function saveHandler(itemName: string, expirationDate: string) {
    if (fridgeItem) {
      updateItemMutation.mutate({
        id: fridgeItem.id,
        name: itemName,
        expirationDate: new Date(expirationDate),
      });
    } else {
      addItemMutation.mutate({
        name: itemName,
        expirationDate: new Date(expirationDate),
      });
    }

    onSave();
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {fridgeItem ? "Update Fridge Item" : "Add Item to Fridge"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <ModifyItemForm
        initialName={fridgeItem?.name}
        initialExpirationDate={fridgeItem?.expirationDate.toISOString()}
        onSave={saveHandler}
      />
      <IonLoading isOpen={addItemMutation.isLoading} />
    </>
  );
};

export default ModifyItemPage;
