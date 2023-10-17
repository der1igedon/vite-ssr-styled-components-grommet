export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Grommet, Box, Text } from "grommet";
import type { PageContextClient } from './types'

// This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
  hydrateRoot(
    document.getElementById('page-view')!,
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
      </Grommet>
  )
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vike.dev/clientRouting */
