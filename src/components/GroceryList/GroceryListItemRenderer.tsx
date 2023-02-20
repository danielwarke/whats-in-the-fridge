import type { FC } from "react";
import type { GroceryListItem } from "@prisma/client";
import { IonCheckbox, IonInput, IonItem, IonReorder } from "@ionic/react";

const GroceryListItemRenderer: FC<{
  groceryListItem: GroceryListItem;
  onRenamed: (newName: string) => void;
  onCompleteToggled: (completed: boolean) => void;
}> = ({ groceryListItem, onRenamed, onCompleteToggled }) => {
  const { name, completed } = groceryListItem;

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={completed}
        onIonChange={(e) => onCompleteToggled(e.target.checked)}
      />
      <IonInput
        className={completed ? "line-through" : ""}
        disabled={completed || undefined}
        placeholder="Enter item name"
        value={name}
        onIonInput={(e) => onRenamed(e.target.value as string)}
        debounce={300}
      />
      <IonReorder slot="end" />
    </IonItem>
  );
};

export default GroceryListItemRenderer;
