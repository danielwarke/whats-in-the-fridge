import { FC, useEffect, useRef } from "react";
import type { GroceryListItem } from "@prisma/client";
import { IonCheckbox, IonInput, IonItem, IonReorder } from "@ionic/react";

const GroceryListItemRenderer: FC<{
  groceryListItem: GroceryListItem;
  onRenamed: (newName: string) => void;
  onCompleteToggled: (completed: boolean) => void;
  isFocused: boolean;
  onFocus: () => void;
  onEnterKey: () => void;
}> = ({
  groceryListItem,
  onRenamed,
  onCompleteToggled,
  isFocused,
  onFocus,
  onEnterKey,
}) => {
  const { name, completed } = groceryListItem;

  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => void inputRef.current?.setFocus(), 100);
    }
  }, [isFocused]);

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={completed}
        onIonChange={(e) => onCompleteToggled(e.target.checked)}
      />
      <IonInput
        ref={inputRef}
        className={completed ? "line-through" : ""}
        disabled={completed || undefined}
        value={name}
        onIonInput={(e) => onRenamed(e.target.value as string)}
        debounce={300}
        onIonFocus={onFocus}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onEnterKey();
          }
        }}
      />
      <IonReorder slot="end" />
    </IonItem>
  );
};

export default GroceryListItemRenderer;
