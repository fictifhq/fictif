<template>
  <Transition name="curtain-fade" @after-enter="onCurtainEntered">
    <div
      v-if="isVisible"
      :class="['fictif-curtain', `fictif-curtain--${mode}`]"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="assertive"
    >
      <!-- Full Mode: Background & Overlay -->
      <template v-if="mode === 'full'">
        <Transition name="content-fade">
          <div
            v-if="isBgImageLoaded"
            class="curtain__bg"
            :style="{ backgroundImage: `url(${background})` }"
          ></div>
        </Transition>
        <div class="curtain__overlay"></div>
      </template>

      <!-- Light Mode Only: Spinner -->
      <div v-if="mode === 'light'" class="curtain__light-spinner-positioner">
        <div class="fictif-spinner">
            <div class="spinner-arc" style="border-top-color: #e5e7eb; animation-delay: -0.45s;"></div>
            <div class="spinner-arc" style="border-top-color: #9ca3af; animation-delay: -0.3s;"></div>
            <div class="spinner-arc" style="border-top-color: white; animation-delay: -0.15s;"></div>
        </div>
      </div>

      <!-- Full Mode Only: Bottom Bar for Message and Spinner -->
      <div v-if="mode === 'full'" class="curtain__bottom-bar">
        <Transition name="content-fade" mode="out-in">
          <p v-if="message" :key="message" class="curtain__message">
            {{ message }}
          </p>
        </Transition>

        <div class="fictif-spinner">
          <div class="spinner-arc" style="border-top-color: #e5e7eb; animation-delay: -0.45s;"></div>
          <div class="spinner-arc" style="border-top-color: #9ca3af; animation-delay: -0.3s;"></div>
          <div class="spinner-arc" style="border-top-color: white; animation-delay: -0.15s;"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, ref, onUnmounted, onMounted, nextTick } from 'vue';
import { useCurtain } from '../composables/curtain';

const isVisible = ref(false);
const mode = ref('full');
const message = ref('');
const background = ref('');
const isBgImageLoaded = ref(false);

const curtainManager = useCurtain();

// --- NEW LOGIC: Pre-curtain removal ---
let preCurtainRemoved = false;
const removePreCurtain = () => {
    if (preCurtainRemoved) return;
    const preCurtainElements = document.querySelectorAll(".fictif-pre-curtain");
    for (const item of preCurtainElements) {
        item.remove();
    }
    preCurtainRemoved = true;
};

// This event is fired by the <Transition> after the curtain has fully faded in.
const onCurtainEntered = () => {
    removePreCurtain();
};
// --- END NEW LOGIC ---

const updateStateFromManager = (newState) => {
  isVisible.value = newState.isVisible;
  mode.value = newState.mode;
  message.value = newState.message;
  background.value = newState.background;
};

onMounted(() => {
  curtainManager.setCurtainMounted(true);
  curtainManager.subscribe(updateStateFromManager);
  updateStateFromManager(curtainManager.state);

  // NEW: Handle edge case where app loads without the curtain being active.
  // If the curtain isn't going to show, remove the pre-curtain right away.
  nextTick(() => {
      if (!isVisible.value) {
          removePreCurtain();
      }
  });
});

onUnmounted(() => {
  curtainManager.setCurtainMounted(false);
  curtainManager.unsubscribe(updateStateFromManager);
  unlockBodyScroll();
});

const lockBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
};

const unlockBodyScroll = () => {
    setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 300);
};

watch(isVisible, (isNowVisible) => {
    if (isNowVisible) {
        lockBodyScroll();
    } else {
        unlockBodyScroll();
    }
});

watch(background, (newBg) => {
    if (!newBg || mode.value !== 'full') {
        isBgImageLoaded.value = false;
        return;
    }
    const img = new Image();
    img.src = newBg;
    img.onload = () => { if (background.value === newBg) isBgImageLoaded.value = true; };
    img.onerror = () => { isBgImageLoaded.value = false; };
}, { immediate: true });
</script>

<style>
/* Styles remain the same as the previous version */
.fictif-curtain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  font-family: monospace;
  pointer-events: none;
}
.fictif-curtain--full {
  background-color: #000;
  color: #fff;
}
.fictif-curtain--light {
  background: linear-gradient(-45deg, #eef2f3, #dce3e4, #c9d6de, #b7c4cf);
  background-size: 400% 400%;
  animation: gradient-bg 15s ease infinite;
}
@keyframes gradient-bg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.curtain__bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(4px) brightness(0.8);
}
.curtain__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
}
.curtain__bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px;
}
.curtain__message {
  max-width: 65%;
  font-size: 18px;
  color: #d1d5db;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  margin: 0;
}
.curtain__light-spinner-positioner {
    position: absolute;
    bottom: 40px;
    right: 40px;
    z-index: 3;
}
.fictif-spinner {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}
.spinner-arc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  animation: spinner-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
@keyframes spinner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.curtain-fade-enter-active,
.curtain-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.curtain-fade-enter-from,
.curtain-fade-leave-to {
  opacity: 0;
}
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}
</style>