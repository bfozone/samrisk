import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { loginRequest } from './msalConfig'
import { getMsalInstance } from './msalInstance'

export async function acquireToken(): Promise<string | null> {
  const msal = getMsalInstance()
  const accounts = msal.getAllAccounts()
  if (!accounts.length)
    return null

  try {
    const result = await msal.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    })
    return result.accessToken
  }
  catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msal.acquireTokenRedirect(loginRequest)
      return null
    }
    throw error
  }
}
