<script setup lang="ts">
import {
  watchEffect,
  useAttrs,
  useSlots,
  onMounted,
  onUnmounted,
  type VNode,
  Comment,
  Fragment,
  Text,
} from 'vue';

import { useHead, type HeadUpdateData, type HeadManager } from '../composables/head';

const attrs = useAttrs();
const slots = useSlots();

let manager: HeadManager | undefined;
try {
  manager = useHead();
} catch (e) {
  console.error('[Fictif Head] Missing global head manager. Did you forget to provide it?');
}

const parseSlotsToData = (): HeadUpdateData => {
  const data: HeadUpdateData = { children: [] };
  if (!slots.default) return data;

  const walk = (nodes: VNode[]) => {
    for (const vnode of nodes) {
      if (!vnode || vnode.type === Comment || vnode.type === Text) continue;

      if (vnode.type === Fragment && Array.isArray(vnode.children)) {
        walk(vnode.children as VNode[]);
        continue;
      }

      if (typeof vnode.type === 'string') {
        let innerContent = '';

        if (Array.isArray(vnode.children)) {
          innerContent = vnode.children
            .map(child => {
              if (typeof child === 'string') return child;
              if ((child as VNode).type === Text) return (child as VNode).children as string;
              return '';
            })
            .join('');
        } else if (typeof vnode.children === 'string') {
          innerContent = vnode.children;
        }

        if (vnode.type.toLowerCase() === 'title') {
          data.title = innerContent;
        } else {
          data.children!.push({
            elementTagType: vnode.type,
            innerHTML: innerContent || undefined,
            ...(vnode.props || {}),
          });
        }
      }
    }
  };

  walk(slots.default());
  return data;
};

const updateHead = () => {
  if (!manager) return;

  const propsData = { ...attrs };
  const slotsData = parseSlotsToData();

  const finalData: HeadUpdateData = {
    reset: true,
    ...propsData,
    ...slotsData,
    children: [
      ...(propsData.children as HeadUpdateData['children'] || []),
      ...(slotsData.children || []),
    ],
  };

  manager.update(finalData);
};

onMounted(() => {
  updateHead();
  watchEffect(updateHead);
});

onUnmounted(() => {
  if (manager) {
    manager.update({ reset: true });
  }
});
</script>

<template>
  <!-- This component is intentionally renderless -->
</template>
