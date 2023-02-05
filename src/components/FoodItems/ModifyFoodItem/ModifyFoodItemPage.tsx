import {
  IonButton,
  IonButtons,
  IonHeader,
  IonLoading,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { api } from "../../../utils/api";
import ModifyFoodItemForm from "./ModifyFoodItemForm";
import type { FC } from "react";
import React from "react";
import type { FoodItem } from "@prisma/client";
import { capitalizeFirstLetter } from "../../../utils/string";

const ModifyFoodItemPage: FC<{
  container: "fridge" | "pantry";
  foodItem?: FoodItem;
  onClose: () => void;
}> = ({ container, foodItem, onClose }) => {
  const [presentToast] = useIonToast();
  const util = api.useContext();

  const addItemMutation = api.food.addItem.useMutation({
    onSuccess: async () => {
      await util.food.listItems.invalidate();
    },
  });

  const updateItemMutation = api.food.updateItem.useMutation({
    onSuccess: async () => {
      await util.food.listItems.invalidate();
    },
  });

  function saveHandler(itemName: string, expirationDate: string) {
    if (foodItem) {
      updateItemMutation.mutate({
        id: foodItem.id,
        name: itemName,
        expirationDate: new Date(expirationDate),
        container: foodItem.container as "fridge" | "pantry",
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
        message: foodItem
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
            {foodItem
              ? "Update Item"
              : `Add Item to ${capitalizeFirstLetter(container)}`}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <ModifyFoodItemForm
        initialName={foodItem?.name}
        initialExpirationDate={foodItem?.expirationDate.toISOString()}
        onSave={saveHandler}
      />
      <IonLoading isOpen={addItemMutation.isLoading} />
    </>
  );
};

export default ModifyFoodItemPage;
