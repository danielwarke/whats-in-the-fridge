import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { api } from "../../utils/api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import ItemRenderer from "./ItemRenderer";
import ModifyItemPage from "../ModifyItem/ModifyItemPage";
import type { FoodItem } from "@prisma/client";
import { emojiMap } from "../../utils/emoji";
import { capitalizeFirstLetter } from "../../utils/string";

const ItemListPage: FC<{ container: "fridge" | "pantry" }> = ({
  container,
}) => {
  const [presentAlert] = useIonAlert();
  const [presentToast, dismissToast] = useIonToast();
  const util = api.useContext();

  const { data: preferences = { emoji: "pizza" } } =
    api.user.preferences.useQuery();

  const { data: foodItems = [] } = api.food.listItems.useQuery({
    container,
  });

  const createFoodItemMutation = api.food.addItem.useMutation({
    onSuccess: async () => {
      await util.food.listItems.invalidate();
    },
  });

  const udpateFoodItemMutation = api.food.updateItem.useMutation({
    onSuccess: async () => {
      await util.food.listItems.invalidate();
    },
  });

  function confirmMoveFoodItem(
    foodItem: FoodItem,
    destination: "fridge" | "pantry"
  ) {
    void presentAlert({
      header: "Please Confirm",
      message: `Are you sure you would like to move ${foodItem.name} to the ${destination}?`,
      buttons: [
        "Cancel",
        {
          text: "Confirm",
          handler: () => {
            udpateFoodItemMutation.mutate({
              ...foodItem,
              container: destination,
            });
            void presentToast(
              `Moved ${foodItem.name} to the ${destination}`,
              2000
            );
          },
        },
      ],
    });
  }

  const deleteFoodItemMutation = api.food.deleteItem.useMutation({
    onSuccess: async (deletedItem) => {
      await util.food.listItems.invalidate();
      await dismissToast();
      void presentToast({
        message: `Removed ${deletedItem.name}`,
        buttons: [
          {
            text: "Undo",
            handler: () => {
              createFoodItemMutation.mutate({
                name: deletedItem.name,
                expirationDate: deletedItem.expirationDate,
                container: deletedItem.container as "fridge" | "pantry",
              });
            },
          },
        ],
        duration: 5000,
      });
    },
  });

  const deleteFoodItem = useCallback(
    (itemId: string) => {
      deleteFoodItemMutation.mutate({ id: itemId });
    },
    [deleteFoodItemMutation]
  );

  const emojiSymbol = emojiMap[preferences.emoji] ?? "🍕";
  const [search, setSearch] = useState("");
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem>();

  const filteredFoodItems = useMemo(() => {
    if (!search) return foodItems;
    return foodItems.filter((foodItem) =>
      foodItem.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [foodItems, search]);

  function handleModifyModalClosed() {
    setIsModifyModalOpen(false);
    setTimeout(() => {
      setSelectedFoodItem(undefined);
    }, 100);
  }

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar color={container === "fridge" ? "secondary" : "warning"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{`${emojiSymbol} What's in the ${capitalizeFirstLetter(
            container
          )}?`}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsModifyModalOpen(true)}>
              Add item
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={search}
          onIonChange={(e) => setSearch(e.target.value as string)}
          disabled={foodItems.length === 0}
          placeholder={`Search the ${container}`}
          showClearButton="focus"
        />
        {foodItems.length === 0 && (
          <IonItem lines="none" className="mt-3">
            <IonText>
              <h2>{`Nothing is in the ${container}!`}</h2>
              <h4>Add some groceries by clicking the add item button.</h4>
            </IonText>
          </IonItem>
        )}
        {foodItems.length > 0 && !!search && filteredFoodItems.length === 0 && (
          <IonItem
            lines="none"
            className="mt-3"
          >{`Couldn't find ${search} in the ${container}`}</IonItem>
        )}
        <IonList>
          {filteredFoodItems.map((foodItem) => (
            <ItemRenderer
              key={foodItem.id}
              foodItem={foodItem}
              onClick={() => {
                setSelectedFoodItem(foodItem);
                setIsModifyModalOpen(true);
              }}
              onMove={(destination) =>
                confirmMoveFoodItem(foodItem, destination)
              }
              onDelete={deleteFoodItem}
            />
          ))}
        </IonList>
        <IonModal isOpen={isModifyModalOpen}>
          <ModifyItemPage
            container={container}
            foodItem={selectedFoodItem}
            onClose={handleModifyModalClosed}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ItemListPage;
