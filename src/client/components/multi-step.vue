<!-- src/client/components/multi-step.vue -->

<template>
  <div
    ref="container"
    class="fictif-multistep"
    :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div v-if="isTransitioning" class="fictif-multistep__overlay"></div>

    <Transition
      :name="transitionName"
      @after-enter="onAfterEnter"
    >
      <div
        v-if="currentStep"
        :key="currentStep"
        class="fictif-multistep__step"
        ref="stepEl"
      >
        <div class="fictif-multistep__content" ref="contentEl">
          <slot :name="currentStep" />
        </div>
      </div>
    </Transition>

  </div>
  <div ref="sizerEl" class="fictif-multistep__sizer">
    <slot :name="sizerStep" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, defineEmits, useSlots } from 'vue';

const emit = defineEmits(['before-leave', 'after-leave']);
const slots = useSlots();

const container = ref(null);
const contentEl = ref(null);
const sizerEl = ref(null);

const isTransitioning = ref(false);
const transitionDirection = ref('next');
const touchStartX = ref(0);
const minSwipeDistance = 50;

// build an array of step‑names from your named slots
const steps = computed(() =>
  slots.default ? slots.default().map(v => v.props.name) : Object.keys(slots)
);

const currentStepIndex = ref(0);
const currentStep = computed(() => steps.value[currentStepIndex.value]);
const transitionName = computed(() => `ms-slide-${transitionDirection.value}`);

// this controls which slot the hidden sizer is rendering
const sizerStep = ref(currentStep.value);

const containerWidth = ref(0);
const containerHeight = ref(0);
const canGoNext = computed(() => currentStepIndex.value < steps.value.length - 1);
const canGoBack = computed(() => currentStepIndex.value > 0);

/** read width/height from a given element ref */
function readSize(el) {
  if (!el) return { w: 0, h: 0 };
  const { width, height } = el.getBoundingClientRect();
  return { w: Math.round(width), h: Math.round(height) };
}

onMounted(async () => {
  // initialize container to first step’s size
  await nextTick();
  const { w, h } = readSize(contentEl.value);
  containerWidth.value = w;
  containerHeight.value = h;
});

/**
 * Slide + size transition
 */
async function attemptTransition(targetIndex) {
  if (isTransitioning.value ||
      targetIndex < 0 ||
      targetIndex >= steps.value.length ||
      targetIndex === currentStepIndex.value) {
    return;
  }

  // 1) before-leave hook
  let cancelled = false;
  const cancel = () => (cancelled = true);
  let resolveNext;
  const direction = targetIndex > currentStepIndex.value ? 'next' : 'prev';
  const payload = {
    from: currentStep.value,
    to: steps.value[targetIndex],
    direction,
    next: () => resolveNext(),
    cancel,
  };
  await new Promise(res => {
    resolveNext = res;
    emit('before-leave', payload);
    resolveNext();
  });
  if (cancelled) return;

  // 2) measure old on-screen
  await nextTick();
  const { w: oldW, h: oldH } = readSize(contentEl.value);

  // 3) prepare hidden sizer for the new step
  sizerStep.value = steps.value[targetIndex];
  await nextTick();
  const { w: newW, h: newH } = readSize(sizerEl.value);

  // 4) actually swap currentStep so the Transition can run
  transitionDirection.value = direction;
  currentStepIndex.value = targetIndex;
  isTransitioning.value = true;

  // 5) force container to old size, then in next tick to new size
  containerWidth.value = oldW;
  containerHeight.value = oldH;
  await nextTick();
  containerWidth.value = newW;
  containerHeight.value = newH;
}

function onAfterEnter() {
  isTransitioning.value = false;
  emit('after-leave', { current: currentStep.value });
}

// Touch/swipe logic
const handleTouchStart = e => (touchStartX.value = e.touches[0].clientX);
const handleTouchEnd = e => {
  const dx = e.changedTouches[0].clientX - touchStartX.value;
  if (Math.abs(dx) < minSwipeDistance) return;
  dx < 0 ? next() : back();
};

// Public API
const goto = name => {
  const idx = steps.value.indexOf(name);
  attemptTransition(idx);
};
const next = () => canGoNext.value && attemptTransition(currentStepIndex.value + 1);
const back = () => canGoBack.value && attemptTransition(currentStepIndex.value - 1);

defineExpose({ goto, next, back, currentStep, currentStepIndex, steps, canGoNext, canGoBack });
</script>

<style>
.fictif-multistep {
  display: grid;
  position: relative;
  overflow: hidden;
  transition:
    width 0.4s cubic-bezier(0.4,0,0.2,1),
    height 0.4s cubic-bezier(0.4,0,0.2,1);
}
.fictif-multistep__overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
}
.fictif-multistep__step {
  grid-column: 1;
  grid-row: 1;
}
.fictif-multistep__content {
  overflow: hidden;
}
/* Hidden sizer: invisible off-screen measurement */
.fictif-multistep__sizer {
  position: absolute;
  top: -9999px;
  left: -9999px;
  visibility: hidden;
  min-width: 0;
  min-height: 0;
  width: auto;
  height: auto;
  pointer-events: none;
}

/* slide animations */
.ms-slide-next-enter-active,
.ms-slide-next-leave-active,
.ms-slide-prev-enter-active,
.ms-slide-prev-leave-active {
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
}
.ms-slide-next-enter-from { transform: translateX(100%); }
.ms-slide-next-leave-to  { transform: translateX(-100%); }
.ms-slide-prev-enter-from { transform: translateX(-100%); }
.ms-slide-prev-leave-to  { transform: translateX(100%); }
</style>
