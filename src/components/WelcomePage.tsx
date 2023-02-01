import type { FC } from "react";
import React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { signIn } from "next-auth/react";

setupIonicReact();

const WelcomePage: FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{"🍕 What's in the Fridge?"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => void signIn()}>Sign in</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonText>
            <h1>
              {
                "Keep track of what's in your fridge and pantry. Get warned before food expires so you can throw away less food."
              }
            </h1>
            <h3>Use the sign in button to get started.</h3>
          </IonText>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
