
/// <reference types="vite/client" />

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
          auto_select?: boolean;
        }) => void;
        prompt: (callback: (notification: { 
          isNotDisplayed: () => boolean;
          isSkippedMoment: () => boolean;
        }) => void) => void;
        renderButton: (element: HTMLElement, options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          shape?: string;
          logo_alignment?: string;
          width?: number;
        }) => void;
      };
    };
  };
}
