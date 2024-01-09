<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import type { EmptyStateObject, ErrorStateObject, AnyStateObject, SelectionStateObject } from '@/states';
import MetaText from './MetaText.vue';

defineProps<{
  state: EmptyStateObject | ErrorStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
}>();

const startSelection = () => {
  const newState: SelectionStateObject = { name: 'SelectionState' };
  emit('setState', newState);
};

</script>

<template>
  <InterfaceLayout>
    <template #header>
      <StreamUIText>
        No source shared
      </StreamUIText>
    </template>
    <template
      v-if="state.name === 'ErrorState'"
      #video-overlay
    >
      {{ state.message }}
    </template>
    <template #footer>
      <StreamUIButton @click="startSelection">
        🖥️ Select/share source
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      This is an online screen recorder to easily record video clips of your screen without downloading or installing anything.
    </p>
    <p>
      To start, press the [Select/share source] button to choose a window or screen to record from, just like sharing your screen on a video call.
    </p>
  </MetaText>
</template>

<style>
</style>
