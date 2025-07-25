// src/client/composables/progress.ts

import { ref, shallowRef, readonly, type Ref } from 'vue';

export interface InspirationalMessage {
  message: string;
  background: string;
}

export const defaults: {
  inspirationalMessages: InspirationalMessage[];
} = {
  inspirationalMessages: [
    {
      message: "“Success usually comes to those who are too busy to be looking for it.” — Henry David Thoreau",
      background: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
      message: "“Opportunities don't happen, you create them.” — Chris Grosser",
      background: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
    },
    {
      message: "“Don’t be afraid to give up the good to go for the great.” — John D. Rockefeller",
      background: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
    }
  ]
};


interface ProgressState {
    readonly isLoading: Ref<boolean>;
    readonly message: Ref<string>;
    readonly background: Ref<string>;
    start: ({
        customMessage,
        customBackground,

    }?: {

        customMessage?: string,
        customBackground?: string,
    }) => void;
    finish: () => void;
}

let progressInstance: ProgressState | null = null;
let messageInterval: number | undefined;

function createProgressManager(): ProgressState {
    const isLoading = ref(false);
    const message = ref('');
    const background = ref('');

    const selectRandomMessage = () => {
        const chosen = defaults.inspirationalMessages[Math.floor(Math.random() * defaults.inspirationalMessages.length)];
        if(!chosen) return;

        message.value = chosen.message;
        background.value = chosen.background;
    };

    const start = ({
        customMessage,
        customBackground,
    }: {
        customMessage?: string,
        customBackground?: string,
    } = {}) => {
        clearInterval(messageInterval);

        isLoading.value = true;

        if (customMessage) message.value = customMessage;
        if (customBackground) background.value = customBackground;
    };



    const finish = () => {
        isLoading.value = false;
        messageInterval = window.setInterval(selectRandomMessage, 4000);
    };

    // Select one immediately so it's ready
    selectRandomMessage();
    messageInterval = window.setInterval(selectRandomMessage, 4000);
    finish();

    return {
        isLoading: readonly(isLoading),
        message: readonly(message),
        background: readonly(background),
        start,
        finish,
    };
}

/**
 * Provides access to the global Fictif progress indicator state.
 */
export function useProgress(): ProgressState {
    if (!progressInstance) {
        progressInstance = createProgressManager();
    }

    return progressInstance;
}