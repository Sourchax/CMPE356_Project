export function useSessionToken() {
  const getToken = () => {
    return document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith('__session='))
      ?.split('=')[1] || null;
  };
  
  return getToken();
}