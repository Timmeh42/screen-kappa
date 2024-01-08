<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import type { EmptyStateObject, ErrorStateObject, AnyStateObject, SelectionStateObject } from '@/states';

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
        Select/share source
      </StreamUIButton>
    </template>
  </InterfaceLayout>
</template>

<style>
</style>
