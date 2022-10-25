import "../styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Header from "../components/Header/Header";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>On-Chain Todo App</title>
        <meta name="description" content="A decentrallized todo application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
