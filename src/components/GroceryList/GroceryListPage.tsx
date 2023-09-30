import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../utils/api";
import type { ItemReorderEventDetail } from "@ionic/react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonReorderGroup,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import GroceryListItemRenderer from "./GroceryListItemRenderer";
import { trashOutline } from "ionicons/icons";
import type { GroceryListItem } from "@prisma/client";

const GroceryListPage: FC = () => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const util = api.useContext();

  const { data: apiGroceryList = [], isInitialLoading } =
    api.groceryList.list.useQuery();

  const overwriteList = useRef(true);
  const [groceryListItems, setGroceryListItems] = useState<GroceryListItem[]>(
    []
  );
  const [focusedId, setFocusedId] = useState("");

  const addItemMutation = api.groceryList.add.useMutation({
    onSuccess: (addedItem) => {
      setGroceryListItems((currentListItems) => {
        const updatedListItems = [...currentListItems];

        const focusedItemIdx = updatedListItems.findIndex(
          (item) => item.id === focusedId
        );

        if (focusedItemIdx > -1) {
          updatedListItems.splice(focusedItemIdx + 1, 0, addedItem);
        } else {
          updatedListItems.push(addedItem);
        }

        return updatedListItems;
      });
      setFocusedId(addedItem.id);
    },
  });

  const updateItemMutation = api.groceryList.update.useMutation();

  const reorderItemsMutation = api.groceryList.updateSortOrder.useMutation();

  const deleteCompletedMutation = api.groceryList.deleteCompleted.useMutation({
    onSuccess: async (deletedItems) => {
      overwriteList.current = true;
      await util.groceryList.list.invalidate();
      void presentToast(
        `Deleted ${deletedItems.count} item${
          deletedItems.count > 1 ? "s" : ""
        }`,
        1500
      );
    },
  });

  const [search, setSearch] = useState("");

  const filteredGroceryList = useMemo(() => {
    if (!search) return groceryListItems;
    return groceryListItems.filter((listItem) =>
      listItem.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groceryListItems, search]);

  useEffect(() => {
    if (isInitialLoading) return;
    if (overwriteList.current) {
      setGroceryListItems(apiGroceryList);
      overwriteList.current = false;
    }
  }, [apiGroceryList, isInitialLoading]);

  function confirmDeleteCompletedItems() {
    void presentAlert({
      header: "Please Confirm",
      message: "Would you like to delete all completed grocery list items?",
      buttons: [
        "Cancel",
        {
          text: "Confirm",
          handler: () => {
            deleteCompletedMutation.mutate();
          },
        },
      ],
    });
  }

  function handleAddItem() {
    addItemMutation.mutate({
      name: "",
    });
  }

  function handleRename(listItem: GroceryListItem, newName: string) {
    setGroceryListItems((currentListItems) =>
      currentListItems.map((item) => {
        if (item.id === listItem.id) {
          item.name = newName;
        }

        return item;
      })
    );

    updateItemMutation.mutate({
      id: listItem.id,
      name: newName,
      completed: listItem.completed,
    });
  }

  function handleCompleteToggled(
    listItem: GroceryListItem,
    completed: boolean
  ) {
    setGroceryListItems((currentListItems) =>
      currentListItems.map((item) => {
        if (item.id === listItem.id) {
          item.completed = completed;
        }

        return item;
      })
    );

    updateItemMutation.mutate({
      id: listItem.id,
      name: listItem.name,
      completed,
    });
  }

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const updatedItems = event.detail.complete(
      groceryListItems
    ) as GroceryListItem[];

    setGroceryListItems(updatedItems);

    reorderItemsMutation.mutate({
      items: updatedItems.map((item, index) => ({
        id: item.id,
        sortOrder: updatedItems.length - index,
      })),
    });
  }

  const hasCompletedItems = useMemo(() => {
    return groceryListItems.some((listItem) => listItem.completed);
  }, [groceryListItems]);

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Grocery List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAddItem}>Add item</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={search}
          onIonInput={(e) => setSearch(e.target.value as string)}
          disabled={groceryListItems.length === 0}
          placeholder={"Search the grocery list"}
          showClearButton="focus"
        />
        {groceryListItems.length === 0 && (
          <IonItem lines="none" className="mt-3">
            <IonText>
              <h2>Nothing is on the grocery list!</h2>
              <h4>
                Add some items to the list by clicking the add item button.
              </h4>
            </IonText>
          </IonItem>
        )}
        {groceryListItems.length > 0 &&
          !!search &&
          filteredGroceryList.length === 0 && (
            <IonItem
              lines="none"
              className="mt-3"
            >{`Couldn't find ${search} in the grocery list`}</IonItem>
          )}
        <IonReorderGroup disabled={!!search} onIonItemReorder={handleReorder}>
          {filteredGroceryList.map((listItem) => (
            <GroceryListItemRenderer
              key={listItem.id}
              groceryListItem={listItem}
              onRenamed={(newName) => handleRename(listItem, newName)}
              onCompleteToggled={(completed) =>
                handleCompleteToggled(listItem, completed)
              }
              onFocus={() => setFocusedId(listItem.id)}
              isFocused={listItem.id === focusedId}
              onEnterKey={handleAddItem}
            />
          ))}
        </IonReorderGroup>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            color="danger"
            disabled={!hasCompletedItems}
            onClick={confirmDeleteCompletedItems}
          >
            <IonIcon icon={trashOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default GroceryListPage;
