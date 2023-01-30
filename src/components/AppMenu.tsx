import type { FC } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenu,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { emojiMap } from "../utils/emoji";

const AppMenu: FC = () => {
  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Header Emoji</IonLabel>
          <IonSelect>
            {Object.entries(emojiMap).map(([key, emoji]) => (
              <IonSelectOption key={key}>{emoji}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
