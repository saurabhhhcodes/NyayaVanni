let sessionInitialized = false;

export async function ensureSessionId(apiUrl) {
  if (sessionInitialized) return;

  try {
    const response = await fetch(`${apiUrl}/api/session`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      sessionInitialized = true;
    }
  } catch (error) {
    console.warn('Failed to initialize session cookie:', error);
  }
}

export async function logoutSession(apiUrl) {
  try {
    await fetch(`${apiUrl}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.warn('Logout request failed:', error);
  }
  sessionInitialized = false;
}
