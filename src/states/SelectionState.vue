<script setup lang="ts">
import StreamUIText from '../components/StreamUIText.vue';
import StreamUIButton from '../components/StreamUIButton.vue';
import InterfaceLayout from '../components/InterfaceLayout.vue';
import MetaText from '../components/MetaText.vue';
import type { SelectionStateObject, AnyStateObject, PreviewStateObject, ErrorStateObject } from '@/states';

defineProps<{
  state: SelectionStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
}>();

// record the time when we request a screen share
const selectionStartTime = Date.now();

navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((mediaStream) => {
    const newState: PreviewStateObject = {
      name: 'PreviewState',
      videoTracks: mediaStream.getVideoTracks(),
      audioTracks: mediaStream.getAudioTracks(),
    };
    emit('setState', newState);
  })
  .catch((error: DOMException) => {
    const rejectionTime = Date.now() - selectionStartTime;
    // if request was rejected inhumanly fast, assmue it was blocked by browser and not blocked by user
    const errorMessage = rejectionTime < 100
      ? 'Your browser blocked the request to share your screen for recording. Unblock the screen share permission to record your screen.'
      : 'You blocked the request to share your screen for recording. Unblock the screen share permission or refresh the page to try again.'
    ;
    const newState: ErrorStateObject = {
      name: 'ErrorState',
      error: error,
      message: errorMessage,
    };
    emit('setState', newState);
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
        🙅 Cancel share request
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      Your browser should be asking you to select a window or screen to share so that you can record it.
      If you want to record sound, make sure to select that option if it's available.
    </p>
  </MetaText>
</template>

<style>
</style>
