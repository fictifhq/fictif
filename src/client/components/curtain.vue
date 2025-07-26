<!-- src/client/components/curtain.vue -->

<template>
  <Transition name="curtain-fade">
    <div v-if="show" class="fictif-curtain" aria-hidden="true">
      <Transition name="content-fade">
        <div
          v-if="isBgImageLoaded"
          class="curtain__bg"
          :style="{ backgroundImage: `url(${background})` }"
        ></div>
      </Transition>

      <div class="curtain__overlay"></div>

      <div class="curtain__content">
        <Transition name="content-fade" mode="out-in">
          <p :key="message" class="curtain__message">
            {{ message }}
          </p>
        </Transition>
      </div>

      <div class="fictif-spinner">
        <div class="spinner-arc" style="border-top-color: #9ca3af; animation-delay: -0.5s;"></div>
        <div class="spinner-arc" style="border-top-color: #e5e7eb; animation-delay: -0.3s;"></div>
        <div class="spinner-arc" style="border-top-color: white;"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, ref, onUnmounted, onMounted } from 'vue';

const props = defineProps({
    show: { type: Boolean, default: false },
    message: { type: String, default: '' },
    background: { type: String, default: null },
});

const isBgImageLoaded = ref(false);

onMounted(() => {
  const preCurtain = document.querySelectorAll(".fictif-pre-curtain");
  for (const item of preCurtain) {
    item.remove()
  }
});

const lockBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
};

const unlockBodyScroll = () => {
    // Use a timeout to ensure fade-out transition completes
    setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 300); // Match CSS transition duration
};

watch(() => props.background, (newBg) => {
    if (!newBg) {
        isBgImageLoaded.value = false;
        return;
    }
    // Preload the image to ensure a smooth transition
    const img = new Image();
    img.src = newBg;
    img.onload = () => {
        if (props.background === newBg) { // Ensure the background hasn't changed again
            isBgImageLoaded.value = true;
        }
    };
    img.onerror = () => {
        isBgImageLoaded.value = false; // Don't show a broken background
    };
}, { immediate: true });

watch(() => props.show, (isShowing) => {
    if (isShowing) {
        lockBodyScroll();
    } else {
        unlockBodyScroll();
    }
});

onUnmounted(unlockBodyScroll);
</script>

<style>
/* Main Curtain Styles */
.fictif-curtain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem; /* 32px */
  background-color: #000;
  color: #fff;
  font-family: monospace;
  pointer-events: none;
}

.curtain__bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(4px);
}

.curtain__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
}

.curtain__content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: flex-end;
}

.curtain__message {
  max-width: 70%;
  font-size: 1.125rem; /* 18px */
  color: #d1d5db; /* gray-300 */
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* Spinner Styles */
.fictif-spinner {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  font-size: 0;
  line-height: 0;
  padding: 0;
  margin: 0;
  z-index: 10000; /* Above the curtain content */
}

.spinner-arc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spinner-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes spinner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Vue Transition Styles */
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