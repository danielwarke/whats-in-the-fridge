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
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../utils/string";

const AppMenu: FC = () => {
  const util = api.useContext();
  const { data: emojiData = { emoji: "pizza" } } = api.user.emoji.useQuery();
  const updateEmojiMutation = api.user.setEmoji.useMutation({
    onSuccess: async () => {
      await util.user.emoji.invalidate();
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");

  useEffect(() => {
    if (emojiData) {
      setSelectedEmoji(emojiData.emoji as string);
    }
  }, [emojiData]);

  function handleEmojiChange(emojiValue?: string) {
    if (emojiValue) {
      setSelectedEmoji(emojiValue);
      updateEmojiMutation.mutate({ emoji: emojiValue });
    }
  }

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mein Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Emoji</IonLabel>
          <IonSelect
            value={selectedEmoji}
            onIonChange={(e) => handleEmojiChange(e.target.value as string)}
          >
            {Object.entries(emojiMap).map(([key, emoji]) => (
              <IonSelectOption key={key} value={key}>
                {`${emoji} ${capitalizeFirstLetter(key)}`}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
