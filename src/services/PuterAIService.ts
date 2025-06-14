
class PuterAIService {
  private isInitialized = false;
  private isSignedIn = false;
  private puter: any = null;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Import Puter SDK for browser
      const puterModule = await import('puter');
      this.puter = puterModule.default || puterModule;
      
      console.log('Puter module loaded:', this.puter);
      
      // Initialize Puter SDK
      if (this.puter && typeof this.puter.init === 'function') {
        await this.puter.init();
        this.isInitialized = true;
        console.log('Puter initialized successfully');
        
        // Auto sign-in after initialization
        await this.autoSignIn();
      } else {
        throw new Error('Puter SDK not properly loaded');
      }
    } catch (error) {
      console.error('Failed to initialize Puter:', error);
      // Don't throw the error, just log it to prevent blocking the app
      this.isInitialized = false;
    }
  }

  private async autoSignIn() {
    if (!this.puter || !this.isInitialized) return;
    
    try {
      // Check if Puter auth is available
      if (!this.puter.auth) {
        console.log('Puter auth not available, skipping sign-in');
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
        console.log('Regular sign-in failed, trying anonymous access');
        
        // Fallback to anonymous if regular sign-in fails
        try {
          await this.puter.auth.signInAnonymously();
          this.isSignedIn = true;
          console.log('Signed in anonymously to Puter');
        } catch (anonError) {
          console.error('All sign-in methods failed:', anonError);
        }
      }
    } catch (error) {
      console.error('Auto sign-in process failed:', error);
    }
  }

  async chat(prompt: string): Promise<string> {
    // Always try to initialize if not already done
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isInitialized || !this.puter) {
      throw new Error('Puter SDK is not available. Please check your internet connection.');
    }

    if (!this.isSignedIn) {
      // Try to sign in again
      await this.autoSignIn();
      if (!this.isSignedIn) {
        throw new Error('Unable to connect to Puter AI service. Please try again later.');
      }
    }

    try {
      // Check if AI functionality is available
      if (!this.puter.ai || typeof this.puter.ai.chat !== 'function') {
        throw new Error('Puter AI functionality is not available');
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
      console.error('Puter AI chat error:', error);
      throw new Error('Failed to get AI response from Puter service');
    }
  }

  async generateCode(description: string, language: string = 'javascript'): Promise<string> {
    const prompt = `Generate ${language} code for: ${description}. Only return the code without explanations or markdown formatting.`;
    return this.chat(prompt);
  }

  isReady(): boolean {
    return this.isInitialized && this.isSignedIn;
  }

  getStatus(): { initialized: boolean; signedIn: boolean; error?: string } {
    return {
      initialized: this.isInitialized,
      signedIn: this.isSignedIn
    };
  }
}

export const puterAI = new PuterAIService();
