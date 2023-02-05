import type { FC } from "react";
import React, { useMemo, useState } from "react";
import { api } from "../../utils/api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonReorderGroup,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import GroceryListItemRenderer from "./GroceryListItemRenderer";

const GroceryListPage: FC = () => {
  const util = api.useContext();

  const { data: groceryListItems = [] } = api.groceryList.list.useQuery();

  const addGroceryListItemMutation = api.groceryList.add.useMutation({
    onSuccess: (addedItem) => {
      util.groceryList.list.setData(undefined, (list) =>
        list ? [addedItem, ...list] : [addedItem]
      );
    },
  });

  const updateGroceryListItemMutation = api.groceryList.update.useMutation({
    onSuccess: (updatedItem) => {
      util.groceryList.list.setData(undefined, (list) => {
        if (!list) return [updatedItem];
        return list.map((listItem) => {
          if (listItem.id === updatedItem.id) {
            return updatedItem;
          }

          return listItem;
        });
      });
    },
  });

  const [search, setSearch] = useState("");

  const filteredGroceryList = useMemo(() => {
    if (!search) return groceryListItems;
    return groceryListItems.filter((listItem) =>
      listItem.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groceryListItems, search]);

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Grocery List</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() =>
                addGroceryListItemMutation.mutate({
                  name: "",
                })
              }
            >
              Add item
            </IonButton>
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
              <h2>{`Nothing is in the grocery list!`}</h2>
              <h4>Add some groceries by clicking the add item button.</h4>
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
        <IonReorderGroup>
          {filteredGroceryList.map((listItem) => (
            <GroceryListItemRenderer
              key={listItem.id}
              groceryListItem={listItem}
              onRenamed={(newName) =>
                updateGroceryListItemMutation.mutate({
                  id: listItem.id,
                  name: newName,
                  completed: listItem.completed,
                })
              }
              onCompleteToggled={(completed) =>
                updateGroceryListItemMutation.mutate({
                  id: listItem.id,
                  name: listItem.name,
                  completed,
                })
              }
            />
          ))}
        </IonReorderGroup>
      </IonContent>
    </IonPage>
  );
};

export default GroceryListPage;
