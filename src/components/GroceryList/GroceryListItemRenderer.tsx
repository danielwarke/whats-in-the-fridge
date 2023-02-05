import type { FC } from "react";
import type { GroceryListItem } from "@prisma/client";
import { IonCheckbox, IonInput, IonItem, IonReorder } from "@ionic/react";
import { useState } from "react";

const GroceryListItemRenderer: FC<{
  groceryListItem: GroceryListItem;
  onRenamed: (newName: string) => void;
  onCompleteToggled: (completed: boolean) => void;
}> = ({ groceryListItem, onRenamed, onCompleteToggled }) => {
  const [name, setName] = useState(groceryListItem.name);
  const [completed, setCompleted] = useState(groceryListItem.completed);

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={completed}
        onIonChange={(e) => {
          const newValue = e.target.checked;
          setCompleted(newValue);
          onCompleteToggled(newValue);
        }}
      />
      <IonInput
        className={completed ? "line-through" : ""}
        disabled={completed || undefined}
        placeholder="Enter name"
        value={name}
        onIonInput={(e) => {
          const newValue = e.target.value as string;
          setName(newValue);
          onRenamed(newValue);
        }}
        debounce={300}
      />
      <IonReorder slot="end" />
    </IonItem>
  );
};

export default GroceryListItemRenderer;
