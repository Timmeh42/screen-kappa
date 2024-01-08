<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { State, type AnyState, type ErrorState } from '../states';

// const props = defineProps<{
//   state: SelectionState;
// }>();

const emit = defineEmits<{
  setState: [state: AnyState];
}>();

const selectionStartTime = Date.now();

navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((mediaStream) => {
    emit('setState', { name: State.Preview, mediaStream: mediaStream });
  })
  .catch((error: DOMException) => {
    const rejectionTime = Date.now() - selectionStartTime;
    // if request was rejected inhumanly fast, assmue it was blocked by browser and not blocked by user
    if (rejectionTime < 100) {
      const newState: ErrorState = {
        name: State.Error,
        error: error,
        message: 'Your browser blocked the request to share your screen for recording. Unblock the screen share permission to record your screen.',
      };
      emit('setState', newState);
    } else {
      const newState: ErrorState = {
        name: State.Error,
        error: error,
        message: 'You blocked the request to share your screen for recording. Unblock the screen share permission or refresh the page to try again.',
      };
      emit('setState', newState);
    }
  })
  .catch((other: any) => console.log(other))
;

const cancel = () => {
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

.preview-ui-text {
  color: white;
  line-height: 1;
}
</style>
