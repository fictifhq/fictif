import { ref, reactive, readonly, type Ref } from 'vue';

// --- Types & Defaults ---

export interface InspirationalMessage {
  message: string;
  background: string;
}

export type CurtainMode = 'full' | 'light';

export interface CurtainOptions {
  inspirationalMessages: InspirationalMessage[];
}

export interface StartOptions {
  mode?: CurtainMode;
  customMessage?: string;
  customBackground?: string;
}

export const defaults: CurtainOptions = {
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

// --- Curtain State & Manager ---

interface CurtainState {
  isVisible: boolean;
  mode: CurtainMode;
  message: string;
  background: string;
}

type Listener = (state: Readonly<CurtainState>) => void;

interface CurtainManager {
  readonly state: Readonly<CurtainState>;
  start: (options?: StartOptions) => void;
  done: () => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
  setCurtainMounted: (isMounted: boolean) => void;
}

let curtainInstance: CurtainManager | null = null;
let isCurtainMounted = false;
const listeners = new Set<Listener>();

function createCurtainManager(): CurtainManager {
    const state = reactive<CurtainState>({
        isVisible: false,
        mode: 'full',
        message: '',
        background: '',
    });

    const notifyListeners = () => {
        listeners.forEach(listener => listener(readonly(state)));
    };

    const selectRandomMessage = () => {
        const { inspirationalMessages } = defaults;
        if (inspirationalMessages.length === 0) return;
        const chosen = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];

        state.message = chosen.message;
        state.background = chosen.background;
    };

    const start = (options: StartOptions = {}) => {
        if (!isCurtainMounted) {
            console.warn(
                'Curtain.start() was called, but no <Curtain> component is mounted in your application tree currently. Please add `<Curtain />` to your root component (e.g., App.vue).'
            );
            return;
        }

        const { mode = 'full', customMessage, customBackground } = options;

        state.mode = mode;

        if (mode === 'full') {
            if (customMessage) {
                state.message = customMessage;
            } else {
                selectRandomMessage();
            }
            if (customBackground) {
                state.background = customBackground;
            }
        }

        state.isVisible = true;
        notifyListeners();
    };

    const done = () => {
        state.isVisible = false;
        notifyListeners();
    };

    const subscribe = (listener: Listener) => {
        listeners.add(listener);
    };

    const unsubscribe = (listener: Listener) => {
        listeners.delete(listener);
    };

    const setCurtainMounted = (isMounted: boolean) => {
        isCurtainMounted = isMounted;
    }

    // Select initial message
    selectRandomMessage();

    return {
        state: readonly(state),
        start,
        done,
        subscribe,
        unsubscribe,
        setCurtainMounted,
    };
}

/**
 * Provides access to the global Curtain manager.
 */
export function useCurtain(): CurtainManager {
    if (!curtainInstance) {
        curtainInstance = createCurtainManager();
    }
    return curtainInstance;
}

/**
 * Optional: Configure the default curtain options.
 * This should be called once when your app initializes.
 */
export function configureCurtain(options: Partial<CurtainOptions>) {
    Object.assign(defaults, options);
}