import { FC, useState } from "react";
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

const AddItemForm: FC<{
  onSave: (itemName: string, expirationDate: string) => void;
}> = ({ onSave }) => {
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

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
        <IonItem>
          <IonLabel>Expiration Date</IonLabel>
          <IonDatetimeButton datetime="datetime" />
        </IonItem>
        <IonButton
          expand="block"
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
          min={currentDate}
          value={expirationDate}
          onIonChange={(e) => setExpirationDate(e.target.value as string)}
          showDefaultButtons
        />
      </IonModal>
    </>
  );
};

export default AddItemForm;
