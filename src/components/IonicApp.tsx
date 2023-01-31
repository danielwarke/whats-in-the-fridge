import type { FC } from "react";
import React from "react";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { signIn, signOut, useSession } from "next-auth/react";
import ItemListPage from "./ItemList/ItemListPage";
import WelcomePage from "./WelcomePage";
import AppMenu from "./AppMenu";
import { api } from "../utils/api";
import { emojiMap } from "../utils/emoji";

setupIonicReact();

const IonicApp: FC = () => {
  const { data: sessionData } = useSession();
  const { data: emojiData = { emoji: "pizza" } } = api.user.emoji.useQuery(
    undefined,
    {
      enabled: !!sessionData,
    }
  );

  const emojiSymbol = emojiMap[emojiData.emoji] ?? "🍕";

  return (
    <IonApp>
      {sessionData && <AppMenu />}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{`${emojiSymbol} What's in the Fridge?`}</IonTitle>
            <IonButtons slot="end">
              {sessionData ? (
                <IonButton onClick={() => void signOut()}>Sign out</IonButton>
              ) : (
                <IonButton onClick={() => void signIn()}>Sign in</IonButton>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {sessionData ? <ItemListPage /> : <WelcomePage />}
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default IonicApp;
