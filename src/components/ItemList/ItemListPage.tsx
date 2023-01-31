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
  useIonToast,
} from "@ionic/react";
import ItemRenderer from "./ItemRenderer";
import ModifyItemPage from "../ModifyItem/ModifyItemPage";
import type { FridgeItem } from "@prisma/client";
import { emojiMap } from "../../utils/emoji";
import { capitalizeFirstLetter } from "../../utils/string";

const ItemListPage: FC<{ container: "fridge" | "pantry" }> = ({
  container,
}) => {
  const [presentToast, dismissToast] = useIonToast();
  const util = api.useContext();

  const { data: emojiData = { emoji: "pizza" } } = api.user.emoji.useQuery();
  const { data: fridgeItems = [] } = api.fridge.listItems.useQuery({
    container,
  });

  const createFridgeItemMutation = api.fridge.addItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
    },
  });

  const deleteFridgeItemMutation = api.fridge.deleteItem.useMutation({
    onSuccess: async (deletedItem) => {
      await util.fridge.listItems.invalidate();
      await dismissToast();
      void presentToast({
        message: `Removed ${deletedItem.name}`,
        buttons: [
          {
            text: "Undo",
            handler: () => {
              createFridgeItemMutation.mutate({
                name: deletedItem.name,
                expirationDate: deletedItem.expirationDate,
              });
            },
          },
        ],
        duration: 5000,
      });
    },
  });

  const deleteFridgeItem = useCallback(
    (itemId: string) => {
      deleteFridgeItemMutation.mutate({ id: itemId });
    },
    [deleteFridgeItemMutation]
  );

  const emojiSymbol = emojiMap[emojiData.emoji] ?? "🍕";
  const [search, setSearch] = useState("");
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedFridgeItem, setSelectedFridgeItem] = useState<FridgeItem>();

  const filteredFridgeItems = useMemo(() => {
    if (!search) return fridgeItems;
    return fridgeItems.filter((fridgeItem) =>
      fridgeItem.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [fridgeItems, search]);

  function handleModifyModalClosed() {
    setIsModifyModalOpen(false);
    setTimeout(() => {
      setSelectedFridgeItem(undefined);
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
          disabled={fridgeItems.length === 0}
          placeholder={`Search the ${container}`}
          showClearButton="focus"
        />
        {fridgeItems.length === 0 && (
          <IonItem lines="none" className="mt-3">
            <IonText>
              <h2>{`Nothing is in the ${container}!`}</h2>
              <h4>Add some groceries by clicking the add item button.</h4>
            </IonText>
          </IonItem>
        )}
        {fridgeItems.length > 0 &&
          !!search &&
          filteredFridgeItems.length === 0 && (
            <IonItem
              lines="none"
              className="mt-3"
            >{`Couldn't find ${search} in the ${container}`}</IonItem>
          )}
        <IonList>
          {filteredFridgeItems.map((fridgeItem) => (
            <ItemRenderer
              key={fridgeItem.id}
              fridgeItem={fridgeItem}
              onClick={() => {
                setSelectedFridgeItem(fridgeItem);
                setIsModifyModalOpen(true);
              }}
              onDelete={deleteFridgeItem}
            />
          ))}
        </IonList>
        <IonModal isOpen={isModifyModalOpen}>
          <ModifyItemPage
            container={container}
            fridgeItem={selectedFridgeItem}
            onClose={handleModifyModalClosed}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ItemListPage;
