import { NextPage } from "next";
import dynamic from "next/dynamic";
import "@ionic/react/css/core.css";

const AddItem = dynamic(() => import("../components/AddItem/AddItemPage"), {
  ssr: false,
});

const AddItemPage: NextPage = () => {
  return <AddItem />;
};

export default AddItemPage;
