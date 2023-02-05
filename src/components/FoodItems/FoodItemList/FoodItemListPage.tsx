import type { FC } from "react";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  useIonAlert,
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

  const updateFoodItemMutation = api.food.updateItem.useMutation({
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
      message: `Would like to move ${foodItem.name} to the ${destination}?`,
      buttons: [
        "Cancel",
        {
          text: "Confirm",
          handler: () => {
            updateFoodItemMutation.mutate({
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
              text: "Modify",
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
              text: "Delete",
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            switch (detail.data?.action) {
              case "delete":
                deleteFoodItem(selectedFoodItem.id);
                break;
              case "modify":
                setIsModifyModalOpen(true);
                break;
              case "move":
                confirmMoveFoodItem(
                  selectedFoodItem,
                  selectedFoodItem.container === "fridge" ? "pantry" : "fridge"
                );
                break;
              default:
                setSelectedFoodItem(undefined);
            }

            actionSheetDismissed.current = true;
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default FoodItemListPage;
