import { Html, Head, Main, NextScript } from "next/document";

// Next.js restriction: <Html/> from `next/document` must only be used in
// pages/_document. Having this file ensures the Pages Router error pages
// (/_error, /404) can render during prerender/export without triggering the
// "<Html> should not be imported outside of pages/_document" runtime check.

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
