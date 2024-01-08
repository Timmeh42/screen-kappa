<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { State, type AnyState, type SelectionState, type EmptyState, type ErrorState } from '../states';

defineProps<{
  state: EmptyState | ErrorState;
}>();

const emit = defineEmits<{
  setState: [state: AnyState];
}>();

const startSelection = () => {
  const newState: SelectionState = { name: State.Selection };
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
      v-if="state.name === State.Error"
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
.video-placeholder {
  width: 100%;
  padding-bottom: 60%;
  background-color: black;
}

.preview-ui {
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.preview-ui > * {
  flex-grow: 0;
}
</style>
