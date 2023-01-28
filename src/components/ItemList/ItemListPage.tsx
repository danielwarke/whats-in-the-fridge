import React, { FC, useCallback } from "react";
import { api } from "../../utils/api";
import {
  IonAlert,
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
  setupIonicReact,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { FridgeItem } from "@prisma/client";

setupIonicReact();

const ItemListPage: FC = () => {
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const util = api.useContext();
  const { data: fridgeItems = [] } = api.fridge.listItems.useQuery();
  const deleteFridgeItemMutation = api.fridge.deleteItem.useMutation({
    onSuccess: async () => {
      await util.fridge.listItems.invalidate();
      await present({
        message: "Item was thrown out",
      });
    },
  });

  const openDeleteAlert = useCallback(
    async (fridgeItem: FridgeItem) => {
      await presentAlert({
        header: "Please Confirm",
        message: `Are you sure you want to throw away ${fridgeItem.name}?`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Trash it!",
            role: "destructive",
            handler: () => {
              deleteFridgeItemMutation.mutate({ itemId: fridgeItem.id });
            },
          },
        ],
      });
    },
    [presentAlert]
  );

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
            <IonItemSliding key={fridgeItem.id}>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={() => openDeleteAlert(fridgeItem)}
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
              <IonItem>
                <IonLabel>{fridgeItem.name}</IonLabel>
                <IonText>
                  expires on {fridgeItem.expirationDate.toLocaleDateString()}
                </IonText>
              </IonItem>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonApp>
  );
};

export default ItemListPage;
