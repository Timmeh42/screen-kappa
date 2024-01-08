<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import type { SelectionState, AnyState, PreviewState, ErrorState } from '@/states';

defineProps<{
  state: SelectionState;
}>();

const emit = defineEmits<{
  setState: [state: AnyState];
}>();

// record the time when we request a screen share
const selectionStartTime = Date.now();

navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((mediaStream) => {
    const newState: PreviewState = { name: 'PreviewState', mediaStream: mediaStream };
    emit('setState', newState);
  })
  .catch((error: DOMException) => {
    const rejectionTime = Date.now() - selectionStartTime;
    // if request was rejected inhumanly fast, assmue it was blocked by browser and not blocked by user
    if (rejectionTime < 100) {
      const newState: ErrorState = {
        name: 'ErrorState',
        error: error,
        message: 'Your browser blocked the request to share your screen for recording. Unblock the screen share permission to record your screen.',
      };
      emit('setState', newState);
    } else {
      const newState: ErrorState = {
        name: 'ErrorState',
        error: error,
        message: 'You blocked the request to share your screen for recording. Unblock the screen share permission or refresh the page to try again.',
      };
      emit('setState', newState);
    }
  })
  .catch((unknownError: any) => console.error(unknownError))
;

const cancel = () => {
  // there's no way to cancel a screen share request except by reloading the window
  window.location.reload();
};
</script>

<template>
  <InterfaceLayout>
    <template #header>
      <StreamUIText>
        Waiting for source...
      </StreamUIText>
    </template>
    <template #footer>
      <StreamUIButton @click="cancel">
        Cancel share request
      </StreamUIButton>
    </template>
  </InterfaceLayout>
</template>

<style>
</style>
