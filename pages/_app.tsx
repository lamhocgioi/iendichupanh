/* eslint-disable @next/next/no-page-custom-font */
// pages/_app.tsx - App wrapper với desktop layout trên mobile
import type { AppProps } from 'next/app';
import Head from 'next/head';

// Import CSS
import '../styles/globals.css';
import MessengerChat from '@/components/MessengerChat';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* KHÔNG CÓ meta viewport tag - để browser dùng desktop default */}
        {/* Hoặc dùng fixed width desktop viewport: */}
        {/* <meta name="viewport" content="width=980, initial-scale=0.44, user-scalable=yes" /> */}
        
        {/* <meta name="viewport" content="width=980" /> */}
        <meta name="format-detection" content="telephone=no" />

        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <MessengerChat />
    </>
  );
}