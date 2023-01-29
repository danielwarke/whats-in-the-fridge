import type { FC } from "react";
import React from "react";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { signIn, signOut, useSession } from "next-auth/react";

setupIonicReact();

const IonicAppShell: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: sessionData } = useSession();

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{"🍕 What's in the Fridge?"}</IonTitle>
          <IonButtons slot="end">
            {sessionData ? (
              <IonButton onClick={() => void signOut()}>Sign out</IonButton>
            ) : (
              <IonButton onClick={() => void signIn()}>Sign in</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">{children}</IonContent>
    </IonApp>
  );
};

export default IonicAppShell;
