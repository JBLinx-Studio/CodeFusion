
// Google authentication utility functions
export const GOOGLE_CLIENT_ID = '995504384402-h01e6d91m1l0gem7m6c2ejrp3f4hdr84.apps.googleusercontent.com';

// Load the Google API script dynamically
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-auth-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-auth-script';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
  });
};

// Initialize Google client
export const initializeGoogleClient = async (): Promise<void> => {
  await loadGoogleScript();
  
  // We need to wait a bit to make sure google is fully loaded
  return new Promise((resolve) => {
    setTimeout(() => {
      if (window.google && window.google.accounts) {
        resolve();
      } else {
        console.error('Google accounts API not available');
        resolve(); // Resolve anyway to prevent blocking
      }
    }, 300);
  });
};

// Parse JWT token from Google
export const parseGoogleJwt = (token: string): { email: string; name: string; picture?: string } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing Google JWT', error);
    return { email: '', name: '' };
  }
};
