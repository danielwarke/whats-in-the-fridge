import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenu,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { emojiMap } from "../utils/emoji";
import { api } from "../utils/api";
import { capitalizeFirstLetter } from "../utils/string";
import { signIn, signOut, useSession } from "next-auth/react";
import { logoGithub } from "ionicons/icons";

const AppMenu: FC = () => {
  const { data: sessionData } = useSession();
  const util = api.useContext();
  const {
    data: preferences = { emoji: "pizza", notificationsEnabled: false },
    isLoading: preferencesLoading,
  } = api.user.preferences.useQuery();

  const setPreferencesMutation = api.user.setPreferences.useMutation({
    onSuccess: async () => {
      await util.user.preferences.invalidate();
    },
  });

  const [emoji, setEmoji] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (!preferencesLoading) {
      setEmoji(preferences.emoji);
      setNotificationsEnabled(preferences.notificationsEnabled);
    }
  }, [preferences, preferencesLoading]);

  function savePreferences() {
    setPreferencesMutation.mutate({
      emoji,
      notificationsEnabled,
    });
  }

  return (
    <IonMenu contentId="main-content" onIonWillClose={savePreferences}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!!sessionData?.user?.email && (
          <IonItem>
            <IonText className="py-2">{`Logged in as: ${sessionData?.user?.email}`}</IonText>
          </IonItem>
        )}
        <IonItem>
          <IonSelect
            label="Emoji"
            value={emoji}
            onIonChange={(e) => setEmoji(e.target.value as string)}
          >
            {Object.entries(emojiMap)
              .sort()
              .map(([key, emoji]) => (
                <IonSelectOption key={key} value={key}>
                  {`${emoji} ${capitalizeFirstLetter(key)}`}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Enable notifications</IonLabel>
          <IonToggle
            checked={notificationsEnabled}
            onIonChange={(e) => setNotificationsEnabled(e.target.checked)}
            slot="end"
          />
        </IonItem>
        <IonItem
          href="https://github.com/danielwarke/whats-in-the-fridge"
          target="_blank"
        >
          View source code
          <IonIcon icon={logoGithub} slot="end" />
        </IonItem>
        <IonItem button onClick={() => void signIn()}>
          Link accounts
        </IonItem>
        <IonItem button onClick={() => void signOut()}>
          Sign out
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
