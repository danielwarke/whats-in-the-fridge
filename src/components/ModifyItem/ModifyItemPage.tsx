import {
  IonButton,
  IonButtons,
  IonHeader,
  IonLoading,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { api } from "../../utils/api";
import ModifyItemForm from "./ModifyItemForm";
import type { FC } from "react";
import React from "react";
import type { FridgeItem } from "@prisma/client";
import { capitalizeFirstLetter } from "../../utils/string";

const ModifyItemPage: FC<{
  container: "fridge" | "pantry";
  fridgeItem?: FridgeItem;
  onClose: () => void;
}> = ({ container, fridgeItem, onClose }) => {
  const [presentToast] = useIonToast();
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
        container: fridgeItem.container as "fridge" | "pantry",
      });
    } else {
      addItemMutation.mutate({
        name: itemName,
        expirationDate: new Date(expirationDate),
        container,
      });
    }

    onClose();
    setTimeout(() => {
      void presentToast({
        message: fridgeItem
          ? `Updated ${itemName}`
          : `Added ${itemName} to the ${container}`,
        duration: 2000,
      });
    }, 100);
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {fridgeItem
              ? "Update Item"
              : `Add Item to ${capitalizeFirstLetter(container)}`}
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
