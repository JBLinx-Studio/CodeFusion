
import { fallbackAI } from './FallbackAIService';

class PuterAIService {
  private isInitialized = false;
  private isSignedIn = false;
  private puter: any = null;
  private initializationAttempted = false;
  private useFallback = false;

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
      
      // Try auto sign-in
      await this.autoSignIn();
      
    } catch (error) {
      console.log('Puter initialization failed, falling back to local AI:', error);
      this.useFallback = true;
      this.isInitialized = false;
    }
  }

  private async autoSignIn() {
    if (!this.puter || !this.isInitialized || this.useFallback) return;
    
    try {
      if (!this.puter.auth) {
        console.log('Puter auth not available');
        return;
      }

      // Try to get current user first
      try {
        const user = await this.puter.auth.getUser();
        if (user) {
          this.isSignedIn = true;
          console.log('Already signed in to Puter:', user.username);
          return;
        }
      } catch (getUserError) {
        console.log('No existing user session');
      }

      // Try automatic sign-in
      try {
        await this.puter.auth.signIn();
        this.isSignedIn = true;
        console.log('Successfully signed in to Puter');
      } catch (signInError) {
        console.log('Sign-in failed, trying anonymous');
        try {
          await this.puter.auth.signInAnonymously();
          this.isSignedIn = true;
          console.log('Signed in anonymously to Puter');
        } catch (anonError) {
          console.log('All sign-in methods failed');
        }
      }
    } catch (error) {
      console.log('Auto sign-in process failed:', error);
    }
  }

  async chat(prompt: string): Promise<string> {
    // Always try to initialize if not already done
    if (!this.initializationAttempted) {
      await this.initialize();
    }

    // Use fallback if Puter is not available
    if (this.useFallback || !this.isInitialized || !this.puter) {
      return fallbackAI.chat(prompt);
    }

    if (!this.isSignedIn) {
      // Try to sign in again
      await this.autoSignIn();
      if (!this.isSignedIn) {
        // Fall back to local AI if sign-in fails
        return fallbackAI.chat(prompt);
      }
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

  getStatus(): { initialized: boolean; signedIn: boolean; usingFallback: boolean } {
    return {
      initialized: this.isInitialized,
      signedIn: this.isSignedIn,
      usingFallback: this.useFallback
    };
  }
}

export const puterAI = new PuterAIService();
