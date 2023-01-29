import type { FC } from "react";
import React from "react";
import { IonItem, IonText, setupIonicReact } from "@ionic/react";
import IonicAppShell from "./IonicAppShell";

setupIonicReact();

const WelcomePage: FC = () => {
  return (
    <IonicAppShell>
      <IonItem lines="none">
        <IonText>
          <h1>
            {
              "Keep track of what's in the fridge and get warned before food expires so you can throw away less food."
            }
          </h1>
          <h3>Use the sign in button in the header to get started.</h3>
        </IonText>
      </IonItem>
    </IonicAppShell>
  );
};

export default WelcomePage;
