import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './msalConfig'

let msalInstance: PublicClientApplication | null = null

export async function initializeMsal(): Promise<PublicClientApplication> {
  msalInstance = new PublicClientApplication(msalConfig)
  await msalInstance.initialize()
  await msalInstance.handleRedirectPromise()
  return msalInstance
}

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance)
    throw new Error('MSAL not initialized - call initializeMsal() first')
  return msalInstance
}
