import type { FC } from "react";
import type { GroceryListItem } from "@prisma/client";
import { IonCheckbox, IonInput, IonItem, IonReorder } from "@ionic/react";

const GroceryListItemRenderer: FC<{
  groceryListItem: GroceryListItem;
  onRenamed: (newName: string) => void;
  onCompleteToggled: (completed: boolean) => void;
}> = ({ groceryListItem, onRenamed, onCompleteToggled }) => {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={groceryListItem.completed}
        onIonChange={(e) => onCompleteToggled(e.target.checked)}
      />
      <IonInput
        placeholder="Enter name"
        value={groceryListItem.name}
        onIonChange={(e) => onRenamed(e.target.value as string)}
        debounce={300}
      />
      <IonReorder slot="end" />
    </IonItem>
  );
};

export default GroceryListItemRenderer;
