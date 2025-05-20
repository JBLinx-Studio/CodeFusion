
/// <reference types="vite/client" />

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        prompt: (callback: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        renderButton: (element: HTMLElement, options: any) => void;
      };
    };
  };
}
