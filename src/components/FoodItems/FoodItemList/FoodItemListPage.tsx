import type { FC } from "react";
import React, { useMemo, useRef, useState } from "react";
import { api } from "../../../utils/api";
import {
  IonActionSheet,
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
  useIonToast,
} from "@ionic/react";
import FoodItemRenderer from "./FoodItemRenderer";
import ModifyFoodItemPage from "../ModifyFoodItem/ModifyFoodItemPage";
import type { FoodItem } from "@prisma/client";
import { emojiMap } from "../../../utils/emoji";
import { capitalizeFirstLetter } from "../../../utils/string";

const FoodItemListPage: FC<{ container: "fridge" | "pantry" }> = ({
  container,
}) => {
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

  const updateFoodItemMutation = api.food.updateItem.useMutation({
    onSuccess: async () => {
      await util.food.listItems.invalidate();
    },
  });

  const addItemToGroceryListMutation = api.groceryList.add.useMutation({
    onSuccess: (addedItem) => {
      util.groceryList.list.setData(undefined, (list) =>
        list ? [addedItem, ...list] : [addedItem]
      );
      void presentToast(`Added ${addedItem.name} to the grocery list`, 1500);
    },
  });

  function moveFoodItem(foodItem: FoodItem, destination: "fridge" | "pantry") {
    updateFoodItemMutation.mutate({
      ...foodItem,
      container: destination,
    });
    void presentToast(`Moved ${foodItem.name} to the ${destination}`, 1500);
  }

  const deleteFoodItemMutation = api.food.deleteItem.useMutation({
    onSuccess: async (deletedItem) => {
      util.food.listItems.setData({ container }, (list) => {
        if (!list) return [];
        return list.filter((listItem) => listItem.id !== deletedItem.id);
      });

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
        duration: 1500,
      });
    },
  });

  const emojiSymbol = emojiMap[preferences.emoji] ?? "🍕";
  const actionSheetDismissed = useRef(false);
  const [search, setSearch] = useState("");
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
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
          onIonInput={(e) => setSearch(e.target.value as string)}
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
            <FoodItemRenderer
              key={foodItem.id}
              foodItem={foodItem}
              onClick={() => {
                setSelectedFoodItem(foodItem);
                setIsActionSheetOpen(true);
              }}
            />
          ))}
        </IonList>
        <IonModal isOpen={isModifyModalOpen}>
          <ModifyFoodItemPage
            container={container}
            foodItem={selectedFoodItem}
            onClose={handleModifyModalClosed}
          />
        </IonModal>
        <IonActionSheet
          isOpen={!!selectedFoodItem && isActionSheetOpen}
          header="Actions"
          buttons={[
            {
              text: "Update details",
              data: {
                action: "modify",
              },
            },
            {
              text: `Move to ${
                selectedFoodItem?.container === "fridge" ? "pantry" : "fridge"
              }`,
              data: {
                action: "move",
              },
            },
            {
              text: "Add to grocery list",
              data: {
                action: "grocery",
              },
            },
            {
              text: "Remove",
              role: "destructive",
              data: {
                action: "delete",
              },
            },
            {
              text: "Cancel",
              role: "cancel",
              data: {
                action: "cancel",
              },
            },
          ]}
          onDidPresent={() => (actionSheetDismissed.current = false)}
          onDidDismiss={({ detail }) => {
            setIsActionSheetOpen(false);
            if (!selectedFoodItem || actionSheetDismissed.current) return;
            let resetSelection = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            switch (detail.data?.action) {
              case "delete":
                deleteFoodItemMutation.mutate({ id: selectedFoodItem.id });
                break;
              case "modify":
                setIsModifyModalOpen(true);
                resetSelection = false;
                break;
              case "move":
                moveFoodItem(
                  selectedFoodItem,
                  selectedFoodItem.container === "fridge" ? "pantry" : "fridge"
                );
                break;
              case "grocery":
                addItemToGroceryListMutation.mutate({
                  name: selectedFoodItem.name,
                });
                break;
            }

            actionSheetDismissed.current = true;
            if (resetSelection) {
              setSelectedFoodItem(undefined);
            }
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default FoodItemListPage;
