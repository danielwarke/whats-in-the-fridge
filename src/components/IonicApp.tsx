import type { FC } from "react";
import React from "react";
import { IonApp, IonLoading, setupIonicReact } from "@ionic/react";
import { useSession } from "next-auth/react";
import WelcomePage from "./WelcomePage";
import AppMenu from "./AppMenu";
import AppTabs from "./AppTabs";
import { IonReactRouter } from "@ionic/react-router";

setupIonicReact();

const IonicApp: FC = () => {
  const { data: sessionData, status } = useSession();

  return (
    <IonApp>
      <IonLoading isOpen={status === "loading"} />
      {sessionData ? (
        <IonReactRouter>
          <AppMenu />
          <AppTabs />
        </IonReactRouter>
      ) : (
        <WelcomePage />
      )}
    </IonApp>
  );
};

export default IonicApp;
