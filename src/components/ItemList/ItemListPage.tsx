import React, { FC, useMemo, useRef, useState } from "react";
import { api } from "../../utils/api";
import {
  IonApp,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import ItemRenderer from "./ItemRenderer";
import { snowOutline } from "ionicons/icons";
import ModifyItemPage from "../ModifyItem/ModifyItemPage";
import { FridgeItem } from "@prisma/client";

setupIonicReact();

const ItemListPage: FC = () => {
  const [search, setSearch] = useState("");
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedFridgeItem, setSelectedFridgeItem] = useState<FridgeItem>();

  const { data: fridgeItems = [] } = api.fridge.listItems.useQuery();

  const filteredFridgeItems = useMemo(() => {
    if (!search) return fridgeItems;
    return fridgeItems.filter((fridgeItem) =>
      fridgeItem.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [fridgeItems, search]);

  function handleModifyModalClosed() {
    setIsModifyModalOpen(false);
    setSelectedFridgeItem(undefined);
  }

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{"🍕 What's in the Fridge?"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={search}
          onIonChange={(e) => setSearch(e.target.value as string)}
          disabled={fridgeItems.length === 0}
          placeholder="Search the fridge"
          showClearButton="focus"
        />
        {fridgeItems.length === 0 && (
          <IonItem lines="none">
            Nothing is in the fridge! <br />
            Add some groceries by clicking the blue button below.
          </IonItem>
        )}
        {fridgeItems.length > 0 &&
          !!search &&
          filteredFridgeItems.length === 0 && (
            <IonItem lines="none">{`Couldn't find ${search} in the fridge`}</IonItem>
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
            />
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsModifyModalOpen(true)}>
            <IonIcon icon={snowOutline} />
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={isModifyModalOpen}>
          <ModifyItemPage
            fridgeItem={selectedFridgeItem}
            onCancel={handleModifyModalClosed}
            onSave={handleModifyModalClosed}
          />
        </IonModal>
      </IonContent>
    </IonApp>
  );
};

export default ItemListPage;
