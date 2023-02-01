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
  useIonAlert,
} from "@ionic/react";

// max date is 4 years from now
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 4);

const ModifyItemForm: FC<{
  initialName?: string;
  initialExpirationDate?: string;
  onSave: (itemName: string, expirationDate: string) => void;
}> = ({ initialName, initialExpirationDate, onSave }) => {
  const [presentAlert] = useIonAlert();

  const [itemName, setItemName] = useState(initialName || "");
  const [expirationDate, setExpirationDate] = useState(
    initialExpirationDate || ""
  );

  function showRequiredError(message: string) {
    void presentAlert({
      header: "Error",
      message,
      buttons: ["Dismiss"],
    });
  }

  function saveHandler() {
    if (!itemName) {
      showRequiredError("Please enter an item name");
      return;
    }

    if (!expirationDate) {
      showRequiredError("Please enter an expiration date");
      return;
    }

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
        <IonButton expand="block" className="mt-3 px-3" onClick={saveHandler}>
          Save
        </IonButton>
      </IonContent>
      <IonModal keepContentsMounted>
        <IonDatetime
          id="datetime"
          presentation="date"
          className="dark:text-white"
          value={expirationDate}
          onIonChange={(e) => setExpirationDate(e.target.value as string)}
          showDefaultButtons
          max={maxDate.toISOString()}
        />
      </IonModal>
    </>
  );
};

export default ModifyItemForm;
