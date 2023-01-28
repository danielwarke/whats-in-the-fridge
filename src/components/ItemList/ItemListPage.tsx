import React, { FC, useRef } from "react";
import { api } from "../../utils/api";
import {
  IonApp,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import ItemRenderer from "./ItemRenderer";
import { snowOutline } from "ionicons/icons";
import AddItemPage from "../AddItem/AddItemPage";

setupIonicReact();

const ItemListPage: FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const { data: fridgeItems = [] } = api.fridge.listItems.useQuery();

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{"What's in the Fridge?"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {fridgeItems.map((fridgeItem) => (
            <ItemRenderer key={fridgeItem.id} fridgeItem={fridgeItem} />
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton id="open-modal">
            <IonIcon icon={snowOutline} />
          </IonFabButton>
        </IonFab>
        <IonModal ref={modal} trigger="open-modal">
          <AddItemPage
            onCancel={() => modal.current?.dismiss()}
            onSave={() => modal.current?.dismiss()}
          />
        </IonModal>
      </IonContent>
    </IonApp>
  );
};

export default ItemListPage;
