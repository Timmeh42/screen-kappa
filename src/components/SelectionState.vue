<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import { State } from '../states';

const emit = defineEmits<{
  setState: [state: State];
  setStream: [strean: MediaStream];
  setError: [error: DOMException];
}>();

navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((mediaStream) => {
    emit('setStream', mediaStream);
    emit('setState', State.Preview);
  })
  .catch((error: DOMException) => {
    // rejected or some other error
    console.log(error);
    emit('setError', error);
    emit('setState', State.Error);
  })
  .catch((other: any) => console.log(other))
;

const cancel = () => {
  window.location.reload();
};
</script>

<template>
  <div class="preview-container">
    <div class="preview-ui">
      <StreamUIText>
        Waiting for source...
      </StreamUIText>
    </div>
    <div class="video-placeholder" />
    <div class="preview-ui">
      <StreamUIButton @click="cancel">
        Cancel share request
      </StreamUIButton>
    </div>
  </div>
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
