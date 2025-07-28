<!-- src/client/components/display.vue -->

<template>
    <KeepAlive v-if="activeLayout">
        <component :is="activeLayout" v-bind="attrs">
            <component
                :is="screen"
                v-bind="attrs"
                :key="renderKey" />
        </component>
    </KeepAlive>
    <component
        :is="screen"
        v-else
        v-bind="attrs"
        :key="renderKey" />
</template>


<script setup lang="ts">
import { shallowRef, watch, useAttrs, type Component, type PropType } from 'vue';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps({
    screen: {
        type: Object as PropType<Component>,
        required: true,
    },
    renderKey: {
        type: [String, Number],
        required: true,
    }
});

const attrs = useAttrs();
const activeLayout = shallowRef<Component | null>(null);
let previousLayout = null as any;

watch(() => props.screen, (newScreen) => {
    if (!newScreen) {
        activeLayout.value = null;
        previousLayout = null;
        return;
    }

    const screenOptions = newScreen as any;
    const layout = screenOptions.layout || null;
    const title = screenOptions.title || '';
    const meta = screenOptions.meta || [];

    const layoutChanged =
        layout !== previousLayout &&
        (layout?.name && previousLayout?.name
            ? layout.name !== previousLayout.name
            : layout !== previousLayout);

    if (layoutChanged) {
        activeLayout.value = layout;
        previousLayout = layout;
    }
}, { immediate: true });
</script>
