import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { api } from "../../utils/api";
import {
  IonItem,
  IonList,
  IonModal,
  IonSearchbar,
  IonText,
  useIonToast,
} from "@ionic/react";
import ItemRenderer from "./ItemRenderer";
import ModifyItemPage from "../ModifyItem/ModifyItemPage";
import type { FridgeItem } from "@prisma/client";

const ItemListPage: FC = () => {
  const [presentToast, dismissToast] = useIonToast();
  const util = api.useContext();
  const { data: fridgeItems = [] } = api.fridge.listItems.useQuery();

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
    <>
      <IonSearchbar
        value={search}
        onIonChange={(e) => setSearch(e.target.value as string)}
        disabled={fridgeItems.length === 0}
        placeholder="Search the fridge"
        showClearButton="focus"
      />
      {fridgeItems.length === 0 && (
        <IonItem lines="none" className="mt-3">
          <IonText>
            <h2>Nothing is in the fridge!</h2>
            <h4>Add some groceries by clicking the blue button below.</h4>
          </IonText>
        </IonItem>
      )}
      {fridgeItems.length > 0 &&
        !!search &&
        filteredFridgeItems.length === 0 && (
          <IonItem
            lines="none"
            className="mt-3"
          >{`Couldn't find ${search} in the fridge`}</IonItem>
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
          fridgeItem={selectedFridgeItem}
          onClose={handleModifyModalClosed}
        />
      </IonModal>
    </>
  );
};

export default ItemListPage;
