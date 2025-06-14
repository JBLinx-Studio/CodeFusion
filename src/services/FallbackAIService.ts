
// Simple fallback AI service for when Puter.js is not available
export class FallbackAIService {
  async chat(prompt: string): Promise<string> {
    // Simulate a helpful AI response
    const responses = [
      "I'd be happy to help you with that! Here's what I suggest:\n\n```javascript\n// Your code here\nconsole.log('Hello, world!');\n```",
      "That's a great question! For web development, you might want to consider:\n\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```",
      "Here's a helpful approach for that:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Your Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>\n```",
      "I can help you with that! Try this solution:\n\n```javascript\nfunction handleClick() {\n  alert('Button clicked!');\n}\n```"
    ];
    
    // Return a random helpful response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `${randomResponse}\n\nNote: This is a fallback response since Puter.js AI is currently unavailable. The functionality will be restored once the connection is stable.`;
  }

  isReady(): boolean {
    return true;
  }
}

export const fallbackAI = new FallbackAIService();
