<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { State, type AnyState, type RecordingState, type PreviewState } from '../states';
import { ref, watch } from 'vue';

type Recording = {
  blob: Blob;
  label: string;
  created: number;
  length: number;
  thumbnail: string;
};

const props = defineProps<{
  state: RecordingState;
}>();

const emit = defineEmits<{
  setState: [state: AnyState];
  recordingComplete: [recording: Recording];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);

const startTime = Date.now();

let streamLabel = 'Untitled shared source';
const firstVideoTrack = props.state.mediaStream.getVideoTracks().pop();
if (firstVideoTrack !== undefined) {
  streamLabel = firstVideoTrack.label;
}
let thumbnail = '';

const recordedChunks: Blob[] = [];
const mediaRecorder = new MediaRecorder(props.state.mediaStream, {
  mimeType: 'video/webm;codecs=vp8',
});

mediaRecorder.start();
mediaRecorder.ondataavailable = (blobEvent) => {
  recordedChunks.push(blobEvent.data);
  if (videoElement.value !== null) {
    thumbnail = generateThumbnail(videoElement.value);
  }
};

mediaRecorder.onstop = () => {
  const videoBlob = new Blob(recordedChunks, { type: 'video/webm;codecs=vp8' });
  const recording: Recording = {
    blob: videoBlob,
    label: streamLabel,
    created: Date.now(),
    length: Date.now() - startTime,
    thumbnail,
  };
  emit('recordingComplete', recording);
  const newState: PreviewState = { name: State.Preview, mediaStream: props.state.mediaStream };
  emit('setState', newState);
};

const generateThumbnail = (videoElement: HTMLVideoElement, width = 200, height = 150): string => {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  const ratio = Math.min(width / videoWidth, height / videoHeight);
  const drawWidth = ratio * videoWidth;
  const drawHeight = ratio * videoHeight;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;
  const drawContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  if (drawContext !== null) {
    drawContext.fillStyle = 'black';
    drawContext.fillRect(0, 0, width, height);
    drawContext.drawImage(videoElement, 0, 0, videoWidth, videoHeight, offsetX, offsetY, drawWidth, drawHeight);
  }
  return canvasElement.toDataURL();
};

const stopSharing = () => {
  mediaRecorder.stop();
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of props.state.mediaStream.getTracks()) {
    track.stop();
  }
};

const stopRecording = () => {
  mediaRecorder.stop();
};

// monitor whether mediaStream tracks are active
// this is because the mediaStream can be stopped through the browser which isnt immediately visible to the app
const runningTracks = ref(0);
for (const track of props.state.mediaStream.getTracks()) {
  if (track.readyState === 'live') {
    runningTracks.value++;
    track.onended = () => {
      runningTracks.value--;
    };
  }
}

watch(
  runningTracks,
  () => {
    if (runningTracks.value === 0) {
      stopSharing();
    }
  },
  { immediate: true },
);

</script>

<template>
  <InterfaceLayout>
    <template #header>
      <StreamUIText>
        {{ streamLabel }}
      </StreamUIText>
      <StreamUIText
        highlight
        noshrink
      >
        REC
      </StreamUIText>
    </template>
    <template #video>
      <video
        ref="videoElement"
        autoplay
        muted
        disablepictureinpicture
        :srcObject="props.state.mediaStream"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="stopSharing">
        Stop sharing source
      </StreamUIButton>
      <StreamUIButton @click="stopRecording">
        Stop recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
</template>
