
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

      // Try to import and initialize Puter SDK
      console.log('Attempting to load Puter SDK...');
      
      // Use dynamic import with error handling
      const puterModule = await import('puter').catch(error => {
        console.log('Failed to import puter module:', error);
        return null;
      });
      
      if (!puterModule) {
        console.log('Puter module not available, using fallback');
        this.useFallback = true;
        return;
      }

      this.puter = puterModule.default || puterModule;
      
      if (!this.puter || typeof this.puter.init !== 'function') {
        console.log('Puter SDK not properly structured, using fallback');
        this.useFallback = true;
        return;
      }

      // Try to initialize Puter
      await this.puter.init();
      this.isInitialized = true;
      console.log('Puter initialized successfully');
      
      // Check if already signed in
      await this.checkSignInStatus();
      
    } catch (error) {
      console.log('Puter initialization failed, but keeping Puter available for manual sign-in:', error);
      this.isInitialized = false;
      // Don't use fallback immediately - let user try to sign in
    }
  }

  private async checkSignInStatus() {
    if (!this.puter || !this.isInitialized) return;
    
    try {
      if (!this.puter.auth) {
        console.log('Puter auth not available');
        return;
      }

      // Try to get current user
      const user = await this.puter.auth.getUser();
      if (user) {
        this.isSignedIn = true;
        console.log('Already signed in to Puter:', user.username);
        this.notifySignInListeners(true);
      }
    } catch (error) {
      console.log('No existing user session');
      this.isSignedIn = false;
      this.notifySignInListeners(false);
    }
  }

  async signInWithPopup(): Promise<boolean> {
    try {
      // Open Puter sign-in in a popup
      const signInUrl = 'https://puter.com/action/sign-in?embedded_in_popup=true&msg_id=1';
      const popup = window.open(signInUrl, 'puter-signin', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check if sign-in was successful
            this.checkSignInStatus().then(() => {
              resolve(this.isSignedIn);
            });
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

    // Use fallback if Puter is not available or user not signed in
    if (this.useFallback || !this.isInitialized || !this.isSignedIn) {
      if (!this.isSignedIn && this.isInitialized) {
        return "Please sign in to Puter to use AI features. Click the 'Sign in to Puter' button above.";
      }
      return fallbackAI.chat(prompt);
    }

    try {
      // Check if AI functionality is available
      if (!this.puter.ai || typeof this.puter.ai.chat !== 'function') {
        return fallbackAI.chat(prompt);
      }

      // Use Puter's AI chat functionality
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

      return response.message?.content || response.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.log('Puter AI chat error, using fallback:', error);
      return fallbackAI.chat(prompt);
    }
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
}

export const puterAI = new PuterAIService();
