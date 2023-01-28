import type { FC } from "react";
import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
} from "@ionic/react";

const currentDate = new Date().toISOString();

const ModifyItemForm: FC<{
  initialName?: string;
  initialExpirationDate?: string;
  onSave: (itemName: string, expirationDate: string) => void;
}> = ({ initialName, initialExpirationDate, onSave }) => {
  const [itemName, setItemName] = useState(initialName || "");
  const [expirationDate, setExpirationDate] = useState(
    initialExpirationDate || ""
  );

  function saveHandler() {
    onSave(itemName, expirationDate);
  }

  return (
    <>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Item name</IonLabel>
          <IonInput
            placeholder="Enter item name"
            value={itemName}
            onIonChange={(e) => setItemName(e.target.value as string)}
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Expiration Date</IonLabel>
          <IonDatetimeButton datetime="datetime" />
        </IonItem>
        <IonButton
          expand="block"
          className="px-3"
          disabled={!itemName || !expirationDate}
          onClick={saveHandler}
        >
          Save
        </IonButton>
      </IonContent>
      <IonModal keepContentsMounted>
        <IonDatetime
          id="datetime"
          presentation="date"
          min={initialExpirationDate ? undefined : currentDate}
          value={expirationDate}
          onIonChange={(e) => setExpirationDate(e.target.value as string)}
          showDefaultButtons
        />
      </IonModal>
    </>
  );
};

export default ModifyItemForm;
