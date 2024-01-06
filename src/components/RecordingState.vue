<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import { State } from '../states';
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  stream: MediaStream;
}>();

const emit = defineEmits<{
  setState: [state: State];
  setStream: [strean: MediaStream | null];
}>();

const videoTracks = props.stream.getVideoTracks();
const streamLabel = videoTracks.pop()?.label;

const recordedChunks: Blob[] = [];
const mediaRecorder = new MediaRecorder(props.stream, {
  mimeType: 'video/webm;codecs=vp8',
});

mediaRecorder.start();
mediaRecorder.ondataavailable = (blobEvent) => {
  recordedChunks.push(blobEvent.data);
};

mediaRecorder.onstop = () => {
  const videoBlob = new Blob(recordedChunks, { type: 'video/webm;codecs=vp8' });
  const a = document.createElement('a');
  const videoURL = URL.createObjectURL(videoBlob);
  a.href = videoURL;
  a.download = `${streamLabel} recording ${new Date().toISOString()}.webm`;
  a.click();
};

const stopSharing = () => {
  mediaRecorder.stop();
  emit('setStream', null);
  emit('setState', State.Empty);
};

const stopRecording = () => {
  mediaRecorder.stop();
  emit('setState', State.Preview);
};

const runningTracks = ref(0);
for (const track of props.stream.getTracks()) {
  runningTracks.value++;
  track.addEventListener('ended', () => {
    runningTracks.value--;
  });
  console.log(track, runningTracks.value);
}

watch(runningTracks, () => {
  console.log(runningTracks.value);
  if (runningTracks.value === 0) {
    stopSharing();
  }
});

</script>

<template>
  <div class="preview-container">
    <div class="preview-ui">
      <StreamUIText>
        {{ streamLabel ?? 'Untitled shared source' }}
      </StreamUIText>
      <StreamUIText
        highlight
        noshrink
      >
        REC
      </StreamUIText>
    </div>
    <video
      autoplay
      muted
      :srcObject="props.stream"
    />
    <div class="preview-ui">
      <StreamUIButton @click="stopSharing">
        Stop sharing source
      </StreamUIButton>
      <StreamUIButton @click="stopRecording">
        Stop recording
      </StreamUIButton>
    </div>
  </div>
</template>

<style>
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
