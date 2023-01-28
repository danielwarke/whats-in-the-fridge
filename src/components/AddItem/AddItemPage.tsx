import {
  IonButton,
  IonButtons,
  IonHeader,
  IonLoading,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { api } from "../../utils/api";
import AddItemForm from "./AddItemForm";
import React, { FC, MouseEventHandler } from "react";

const AddItemPage: FC<{
  onCancel: MouseEventHandler;
  onSave: () => void;
}> = ({ onCancel, onSave }) => {
  const util = api.useContext();

  const addItemMutation = api.fridge.addItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
    },
  });

  function addItemHandler(itemName: string, expirationDate: string) {
    addItemMutation.mutate({
      name: itemName,
      expirationDate: new Date(expirationDate),
    });
    onSave();
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Add Item to Fridge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AddItemForm onSave={addItemHandler} />
      <IonLoading isOpen={addItemMutation.isLoading} />
    </>
  );
};

export default AddItemPage;
