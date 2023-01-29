import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { FC } from "react";

const ItemList = dynamic(() => import("../components/ItemList/ItemListPage"), {
  ssr: false,
});

const Welcome = dynamic(() => import("../components/WelcomePage"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Whats in the Fridge?</title>
        <meta
          name="description"
          content="Never forget expired food in the fridge again"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main>
        <RenderAppContent />
      </main>
    </>
  );
};

const RenderAppContent: FC = () => {
  const { data: sessionData } = useSession();
  return sessionData ? <ItemList /> : <Welcome />;
};

export default Home;
