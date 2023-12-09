import Navbar from "@/components/Navbar";
import "../app/globals.css";
import { AppProps } from "next/app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider } from "mobx-react";
import store from "@/store/Store";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const hasAccessToken = localStorage.getItem('access_token');

    // Redirect logic
    if (!hasAccessToken && router.pathname === '/') {
      router.push('/login');
    } else if (hasAccessToken && router.pathname === '/') {
      router.push('/books');
    }
  }, []); // Pass an empty dependency array to run the effect only once on mount

  return (
    <Provider store={store}>
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    </Provider>
  );
}

export default MyApp;
