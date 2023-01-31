import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenu,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { emojiMap } from "../utils/emoji";
import { api } from "../utils/api";
import { capitalizeFirstLetter } from "../utils/string";
import { signOut, useSession } from "next-auth/react";

const AppMenu: FC = () => {
  const { data: sessionData } = useSession();
  const util = api.useContext();
  const { data: emojiData = { emoji: "pizza" } } = api.user.emoji.useQuery();

  const updateEmojiMutation = api.user.setEmoji.useMutation({
    onSuccess: async () => {
      await util.user.emoji.invalidate();
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    context: {
      skipBatch: true,
    } as never,
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");

  useEffect(() => {
    if (emojiData) {
      setSelectedEmoji(emojiData.emoji);
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
        <IonItem button onClick={() => void signOut()}>
          Sign out
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
