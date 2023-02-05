import type { FC } from "react";
import React from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import FoodItemListPage from "./FoodItems/FoodItemList/FoodItemListPage";
import { snowOutline, sparklesOutline } from "ionicons/icons";

const AppTabs: FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/fridge">
          <FoodItemListPage container="fridge" />
        </Route>
        <Route path="/pantry">
          <FoodItemListPage container="pantry" />
        </Route>
        <Route exact path="/">
          <Redirect to="/fridge" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="fridge" href="/fridge">
          <IonIcon icon={snowOutline} />
          <IonLabel>Fridge</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pantry" href="/pantry">
          <IonIcon icon={sparklesOutline} />
          <IonLabel>Pantry</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
