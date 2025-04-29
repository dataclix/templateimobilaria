import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favre.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes"/>
      </Head>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </>

  )
}
