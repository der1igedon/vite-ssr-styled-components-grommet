export { render };
// See https://vike.dev/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import logoUrl from "./logo.svg";
import type { PageContextServer } from "./types";
import { ServerStyleSheet } from "styled-components";
import { Grommet, Box, Text } from "grommet";

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  // This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");

  const sheet = new ServerStyleSheet();
  const pageHtml = ReactDOMServer.renderToString(
    sheet.collectStyles(
      <Grommet
        theme={{
          global: {
            colors: { doc: "#ff99cc" },
          },
        }}
      >
        <Box pad="large" background="doc">
          <Text color="red">Debugtext</Text>
        </Box>
      </Grommet>,
    ),
  );

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const desc =
    (documentProps && documentProps.description) || "App using Vite + vike";

  console.log("Found styles: ", sheet.getStyleTags());
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <style>${dangerouslySkipEscape(sheet.getStyleTags())}</style>

      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  };
}
