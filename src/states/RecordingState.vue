<script setup lang="ts">
import StreamUIText from '../components/StreamUIText.vue';
import StreamUIButton from '../components/StreamUIButton.vue';
import InterfaceLayout from '../components/InterfaceLayout.vue';
import type { AnyStateObject, Recording, RecordingStateObject, EditStateObject } from '@/states';
import { ref } from 'vue';

const props = defineProps<{
  state: RecordingStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
  recordingComplete: [recording: Recording];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);

let streamLabel = 'Untitled recording';
let videoMonitorStream: MediaStream;
const firstVideoTrack = props.state.videoTracks[0];
if (firstVideoTrack !== undefined) {
  streamLabel = `${firstVideoTrack.label} recording`;
  videoMonitorStream = new MediaStream([firstVideoTrack]);
}

// combine audio tracks, as chrome cant record multiple at once
const audioContext = new AudioContext();
const combinedAudio = audioContext.createMediaStreamDestination();
for (const audioTrack of props.state.audioTracks) {
  const audioTrackStream = new MediaStream();
  audioTrackStream.addTrack(audioTrack);
  audioContext
    .createMediaStreamSource(audioTrackStream)
    .connect(combinedAudio)
  ;
}
const recordingStream = new MediaStream([
  ...props.state.videoTracks,
  ...combinedAudio.stream.getAudioTracks(),
]);

const mediaRecorder = new MediaRecorder(recordingStream, {
  mimeType: 'video/webm',
});

const startTime = Date.now();
mediaRecorder.start();

const recordedChunks: Blob[] = [];
mediaRecorder.ondataavailable = (blobEvent) => {
  recordedChunks.push(blobEvent.data);
};

mediaRecorder.onstop = () => {
  const videoBlob = new Blob(recordedChunks, { type: 'video/webm;codecs=vp8' });

  const stopTime = Date.now();
  const recording: Recording = {
    blob: videoBlob,
    label: streamLabel,
    created: stopTime,
    length: stopTime - startTime,
  };
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of [...props.state.videoTracks, ...props.state.audioTracks]) {
    track.stop();
  }
  emit('recordingComplete', recording);
  const newState: EditStateObject = { name: 'EditState', recording: recording, recordingId: 0 };
  emit('setState', newState);
};

const stopSharing = () => {
  mediaRecorder.stop();
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of [...props.state.videoTracks, ...props.state.audioTracks]) {
    track.stop();
  }
};

const stopRecording = () => {
  mediaRecorder.stop();
};

// monitor whether mediaStream tracks are active
// this is because the mediaStream can be stopped through the browser which isnt immediately visible to the app

const checkTracksLiveness = () => {
  const allTracks = [...props.state.videoTracks, ...props.state.audioTracks];
  const allEnded = allTracks.every((track) => track.readyState === 'ended');
  if (allEnded === true) {
    stopSharing();
  }
};

for (const track of [...props.state.videoTracks, ...props.state.audioTracks]) {
  track.onended = checkTracksLiveness;
}
</script>

<template>
  <InterfaceLayout frame-color="#880000">
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
        disablePictureInPicture
        :srcObject="videoMonitorStream"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="stopSharing">
        🚫 Stop sharing source
      </StreamUIButton>
      <StreamUIButton @click="stopRecording">
        ✋ Stop recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
</template>