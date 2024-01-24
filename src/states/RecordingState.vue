<script setup lang="ts">
import StreamUIText from '../components/StreamUIText.vue';
import StreamUIButton from '../components/StreamUIButton.vue';
import InterfaceLayout from '../components/InterfaceLayout.vue';
import MetaText from '../components/MetaText.vue';
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

let videoMonitorStream: MediaStream;
const firstVideoTrack = props.state.videoTracks[0];
if (firstVideoTrack !== undefined) {
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

// if no audio tracks exist, create a silent one to workaround a chrome bug with empty recording blobs
// https://stackoverflow.com/questions/68620750/getting-empty-blob-from-mediarecorder-when-web-audio-api-is-silent#68644274
if (props.state.audioTracks.length === 0) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  oscillator.connect(gainNode);
  gainNode.connect(combinedAudio);
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
    label: props.state.streamLabel,
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

const stopRecording = () => {
  mediaRecorder.stop();
};

// monitor whether mediaStream tracks are active
// this is because the mediaStream can be stopped through the browser which isnt immediately visible to the app
const checkTracksLiveness = () => {
  const allTracks = [...props.state.videoTracks, ...props.state.audioTracks];
  const allEnded = allTracks.every((track) => track.readyState === 'ended');
  if (allEnded === true) {
    mediaRecorder.stop();
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
        {{ props.state.streamLabel }}
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
      <StreamUIButton
        style="margin-left: auto;"
        @click="stopRecording"
      >
        ✋ Stop recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      You are currently recording. To finish, press [Stop Recording] or cancel the screen share, which will also cleanly save your recording.
    </p>
  </MetaText>
</template>
