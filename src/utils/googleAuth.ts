
// Google authentication utility functions
export const GOOGLE_CLIENT_ID = '995504384402-h01e6d91m1l0gem7m6c2ejrp3f4hdr84.apps.googleusercontent.com';

// Check if Google services are available
export const isGoogleAvailable = (): boolean => {
  return !!(window.google && window.google.accounts && window.google.accounts.id);
};

// Load the Google API script dynamically with better error handling
export const loadGoogleScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (document.getElementById('google-auth-script')) {
      console.log('Google script already exists, checking availability...');
      setTimeout(() => resolve(isGoogleAvailable()), 100);
      return;
    }

    console.log('Loading Google authentication script...');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-auth-script';
    script.async = true;
    script.defer = true;
    
    let timeoutId: NodeJS.Timeout;
    
    script.onload = () => {
      console.log('Google script loaded successfully');
      clearTimeout(timeoutId);
      // Wait a bit for Google to initialize
      setTimeout(() => {
        const available = isGoogleAvailable();
        console.log('Google services available:', available);
        resolve(available);
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Google authentication script:', error);
      clearTimeout(timeoutId);
      resolve(false);
    };

    // Set a timeout for loading
    timeoutId = setTimeout(() => {
      console.warn('Google script loading timed out');
      resolve(false);
    }, 10000);

    document.body.appendChild(script);
  });
};

// Initialize Google client with comprehensive error handling
export const initializeGoogleClient = async (): Promise<boolean> => {
  try {
    console.log('Initializing Google client...');
    const scriptLoaded = await loadGoogleScript();
    
    if (!scriptLoaded) {
      console.warn('Google script failed to load - Google sign-in will be unavailable');
      return false;
    }

    // Double-check availability after loading
    if (!isGoogleAvailable()) {
      console.warn('Google services not available after script load');
      return false;
    }

    console.log('Google client initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Google client:', error);
    return false;
  }
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
