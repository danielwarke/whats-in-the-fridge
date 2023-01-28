import { NextPage } from "next";
import { IonApp, IonLoading, setupIonicReact } from "@ionic/react";
import { api } from "../../utils/api";
import AddItemForm from "./AddItemForm";
import { useRouter } from "next/router";

setupIonicReact();

const AddItemPage: NextPage = () => {
  const router = useRouter();
  const addItemMutation = api.fridge.addItem.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  function addItemHandler(itemName: string, expirationDate: string) {
    addItemMutation.mutate({
      name: itemName,
      expirationDate: new Date(expirationDate),
    });
  }

  return (
    <IonApp>
      <AddItemForm onSave={addItemHandler} />
      <IonLoading isOpen={addItemMutation.isLoading} />
    </IonApp>
  );
};

export default AddItemPage;
