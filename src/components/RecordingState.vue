<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import type { AnyStateObject, Recording, RecordingStateObject, EditStateObject } from '@/states';
import { ref, watch } from 'vue';

const props = defineProps<{
  state: RecordingStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
  recordingComplete: [recording: Recording];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);

const startTime = Date.now();

let streamLabel = 'Untitled shared source';
const firstVideoTrack = props.state.mediaStream.getVideoTracks().pop();
if (firstVideoTrack !== undefined) {
  streamLabel = firstVideoTrack.label;
}

const recordedChunks: Blob[] = [];
const mediaRecorder = new MediaRecorder(props.state.mediaStream, {
  mimeType: 'video/webm;codecs=vp8',
});

mediaRecorder.start();
mediaRecorder.ondataavailable = (blobEvent) => {
  recordedChunks.push(blobEvent.data);
};

mediaRecorder.onstop = () => {
  const videoBlob = new Blob(recordedChunks, { type: 'video/webm;codecs=vp8' });
  const recording: Recording = {
    blob: videoBlob,
    label: streamLabel,
    created: Date.now(),
    length: Date.now() - startTime,
  };
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of props.state.mediaStream.getTracks()) {
    track.stop();
  }
  emit('recordingComplete', recording);
  const newState: EditStateObject = { name: 'EditState', recording: recording, recordingId: 0 };
  emit('setState', newState);
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
