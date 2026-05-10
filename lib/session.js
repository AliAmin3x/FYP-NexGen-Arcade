// Simple session management using cookies (client-side helpers)
// Server-side: read from request cookies

export function getSessionFromCookies(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function setSessionCookie(response, sessionData) {
  const value = encodeURIComponent(JSON.stringify(sessionData));
  response.headers.set(
    'Set-Cookie',
    `session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
}

export function clearSessionCookie(response) {
  response.headers.set(
    'Set-Cookie',
    'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
}
