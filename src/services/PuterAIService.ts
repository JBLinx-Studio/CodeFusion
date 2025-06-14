
import { fallbackAI } from './FallbackAIService';

class PuterAIService {
  private isInitialized = false;
  private isSignedIn = false;
  private puter: any = null;
  private initializationAttempted = false;
  private useFallback = false;
  private signInListeners: Array<(status: boolean) => void> = [];

  async initialize() {
    if (this.initializationAttempted) return;
    this.initializationAttempted = true;
    
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, using fallback AI');
        this.useFallback = true;
        return;
      }

      // Try to load Puter from CDN instead of npm package
      console.log('Attempting to load Puter SDK from CDN...');
      
      // Load Puter.js from CDN
      await this.loadPuterFromCDN();
      
      if (!window.puter) {
        console.log('Puter not available from CDN, using fallback');
        this.useFallback = true;
        return;
      }

      this.puter = window.puter;
      
      // Try to initialize Puter
      await this.puter.init();
      this.isInitialized = true;
      console.log('Puter initialized successfully from CDN');
      
      // Check if already signed in
      await this.checkSignInStatus();
      
    } catch (error) {
      console.log('Puter initialization failed:', error);
      this.isInitialized = false;
      this.useFallback = true;
    }
  }

  private async loadPuterFromCDN(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.puter) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = () => {
        console.log('Puter CDN script loaded');
        resolve();
      };
      script.onerror = () => {
        console.log('Failed to load Puter from CDN');
        reject(new Error('Failed to load Puter SDK'));
      };
      document.head.appendChild(script);
    });
  }

  private async checkSignInStatus() {
    if (!this.puter || !this.isInitialized) return;
    
    try {
      // Check if user is signed in by trying to get user info
      const user = await this.puter.auth.getUser();
      if (user && user.username) {
        this.isSignedIn = true;
        console.log('User is signed in to Puter:', user.username);
        this.notifySignInListeners(true);
      } else {
        this.isSignedIn = false;
        this.notifySignInListeners(false);
      }
    } catch (error) {
      console.log('User not signed in or error checking status:', error);
      this.isSignedIn = false;
      this.notifySignInListeners(false);
    }
  }

  async signInWithPopup(): Promise<boolean> {
    try {
      // Open Puter sign-in in a popup
      const signInUrl = 'https://puter.com/action/sign-in?embedded_in_popup=true&msg_id=1';
      const popup = window.open(signInUrl, 'puter-signin', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        throw new Error('Popup blocked');
      }

      return new Promise((resolve) => {
        const checkClosed = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Wait a bit for any auth changes to propagate
            setTimeout(async () => {
              await this.checkSignInStatus();
              resolve(this.isSignedIn);
            }, 2000);
          }
        }, 1000);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          if (popup && !popup.closed) {
            popup.close();
          }
          resolve(false);
        }, 300000);
      });
    } catch (error) {
      console.log('Sign-in popup failed:', error);
      return false;
    }
  }

  onSignInStatusChange(callback: (status: boolean) => void) {
    this.signInListeners.push(callback);
  }

  private notifySignInListeners(status: boolean) {
    this.signInListeners.forEach(listener => listener(status));
  }

  async chat(prompt: string): Promise<string> {
    // Always try to initialize if not already done
    if (!this.initializationAttempted) {
      await this.initialize();
    }

    // Use Puter AI if available and signed in
    if (this.isInitialized && this.isSignedIn && this.puter && this.puter.ai) {
      try {
        console.log('Using Puter AI for chat');
        const response = await this.puter.ai.chat([
          {
            role: 'system',
            content: 'You are a helpful coding assistant for CodeFusion, a web development environment. Help users with HTML, CSS, JavaScript, React, and general web development questions. Provide practical, actionable advice and code examples when appropriate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]);

        return response.message?.content || response.content || response || 'Sorry, I could not generate a response.';
      } catch (error) {
        console.log('Puter AI chat error, using fallback:', error);
        return fallbackAI.chat(prompt);
      }
    }

    // Use fallback if not signed in or Puter not available
    if (!this.isSignedIn && this.isInitialized) {
      return "Please sign in to Puter to use enhanced AI features. Click the 'Sign in to Puter' button above to get started.";
    }
    
    return fallbackAI.chat(prompt);
  }

  async generateCode(description: string, language: string = 'javascript'): Promise<string> {
    const prompt = `Generate ${language} code for: ${description}. Only return the code without explanations or markdown formatting.`;
    return this.chat(prompt);
  }

  isReady(): boolean {
    return this.useFallback || (this.isInitialized && this.isSignedIn);
  }

  getStatus(): { initialized: boolean; signedIn: boolean; usingFallback: boolean; canSignIn: boolean } {
    return {
      initialized: this.isInitialized,
      signedIn: this.isSignedIn,
      usingFallback: this.useFallback,
      canSignIn: this.isInitialized && !this.isSignedIn
    };
  }

  // Method to manually refresh sign-in status
  async refreshStatus() {
    if (this.isInitialized) {
      await this.checkSignInStatus();
    }
  }
}

// Extend Window interface to include puter
declare global {
  interface Window {
    puter: any;
  }
}

export const puterAI = new PuterAIService();
