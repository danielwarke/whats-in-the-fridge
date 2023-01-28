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
import type { FC } from "react";
import React from "react";
import type { FridgeItem } from "@prisma/client";

const ModifyItemPage: FC<{
  fridgeItem?: FridgeItem;
  onCancel: () => void;
  onSave: (successMessage: string) => void;
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

    onSave(
      fridgeItem ? `Updated ${itemName}` : `Added ${itemName} to the fridge`
    );
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {fridgeItem ? "Update Item" : "Add Item to Fridge"}
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
