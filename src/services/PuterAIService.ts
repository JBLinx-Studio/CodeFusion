
import * as puter from 'puter';

class PuterAIService {
  private isInitialized = false;
  private isSignedIn = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize Puter
      await puter.init();
      this.isInitialized = true;
      console.log('Puter initialized successfully');
      
      // Auto sign-in
      await this.autoSignIn();
    } catch (error) {
      console.error('Failed to initialize Puter:', error);
      throw error;
    }
  }

  private async autoSignIn() {
    try {
      // Check if already signed in
      const user = await puter.auth.getUser();
      if (user) {
        this.isSignedIn = true;
        console.log('Already signed in to Puter:', user.username);
        return;
      }

      // Attempt to sign in
      await puter.auth.signIn();
      this.isSignedIn = true;
      console.log('Successfully signed in to Puter');
    } catch (error) {
      console.error('Auto sign-in failed:', error);
      // Try anonymous access if sign-in fails
      try {
        await puter.auth.signInAnonymously();
        this.isSignedIn = true;
        console.log('Signed in anonymously to Puter');
      } catch (anonError) {
        console.error('Anonymous sign-in also failed:', anonError);
      }
    }
  }

  async chat(prompt: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isSignedIn) {
      throw new Error('Not signed in to Puter');
    }

    try {
      // Use Puter's AI chat functionality
      const response = await puter.ai.chat([
        {
          role: 'system',
          content: 'You are a helpful coding assistant for CodeFusion, a web development environment. Help users with HTML, CSS, JavaScript, React, and general web development questions. Provide practical, actionable advice and code examples when appropriate.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return response.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Puter AI chat error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async generateCode(description: string, language: string = 'javascript'): Promise<string> {
    const prompt = `Generate ${language} code for: ${description}. Only return the code without explanations or markdown formatting.`;
    return this.chat(prompt);
  }

  isReady(): boolean {
    return this.isInitialized && this.isSignedIn;
  }
}

export const puterAI = new PuterAIService();
