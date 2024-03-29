<script setup lang="ts">
import StreamUIText from '../components/StreamUIText.vue';
import StreamUIButton from '../components/StreamUIButton.vue';
import InterfaceLayout from '../components/InterfaceLayout.vue';
import MetaText from '../components/MetaText.vue';
import StreamUIToggle from '../components/StreamUIToggle.vue';
import { ref, watch } from 'vue';
import type { PreviewStateObject, AnyStateObject, EmptyStateObject, RecordingStateObject } from '@/states';

const props = defineProps<{
  state: PreviewStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
}>();

// monitor whether media tracks are active
// this is because the tracks can be stopped through the browser which isnt immediately visible to the app
const runningTracks = ref(0);
for (const track of [...props.state.audioTracks, ...props.state.videoTracks]) {
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
      const newState: EmptyStateObject = { name: 'EmptyState' };
      emit('setState', newState);
    }
  },
  { immediate: true },
);

let streamLabel = 'Untitled recording';
let videoMonitorStream: MediaStream;
const firstVideoTrack = props.state.videoTracks[0];
if (firstVideoTrack !== undefined) {
  const defaultLabel = firstVideoTrack.label;
  const chromeLabelMatch = defaultLabel.match(/^(screen|window):(\d):\d$/);
  if (chromeLabelMatch !== null) {
    const surface = chromeLabelMatch[1];
    const prefix = chromeLabelMatch[2] === '0' ? 'Primary' : 'Secondary';
    streamLabel = `${prefix} ${surface} recording`;
  } else {
    streamLabel = `${firstVideoTrack.label} recording`;
  }
  videoMonitorStream = new MediaStream([firstVideoTrack]);
}

const stopSharing = () => {
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of [...props.state.audioTracks, ...props.state.videoTracks]) {
    track.stop();
  }
  const newState: EmptyStateObject = { name: 'EmptyState' };
  emit('setState', newState);
};

const startRecording = () => {
  const recordingAudioTracks = [...props.state.audioTracks];
  if (useMic.value === true && micTrack.value !== undefined) {
    recordingAudioTracks.push(micTrack.value);
  }
  const newState: RecordingStateObject = {
    name: 'RecordingState',
    videoTracks: props.state.videoTracks,
    audioTracks: recordingAudioTracks,
    streamLabel,
  };
  emit('setState', newState);
};

const useMic = ref(false);
const micTrack = ref<MediaStreamTrack>();
watch(useMic, (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((microphoneStream: MediaStream) => {
        const audioTracks = microphoneStream.getAudioTracks();
        micTrack.value = audioTracks[0];
      })
      .catch(() => {
        micTrack.value = undefined;
        useMic.value = false;
      });
  }
});

</script>

<template>
  <InterfaceLayout>
    <template #header>
      <StreamUIText>
        {{ streamLabel ?? 'Untitled shared source' }}
      </StreamUIText>
    </template>
    <template #video>
      <video
        autoplay
        muted
        disablePictureInPicture
        :srcObject="videoMonitorStream"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="stopSharing">
        🚫 Reset
      </StreamUIButton>
      <StreamUIToggle
        v-model="useMic"
        :labels="['no', 'yes']"
      >
        🎤 Record mic?
      </StreamUIToggle>
      <StreamUIButton @click="startRecording">
        🎬 Start recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      Now you can preview what you are sharing, before recording. If you chose the wrong screen or window to record, just press [Reset] to start again.
    </p>
    <p>
      You can choose whether to also record your microphone, and press [Start Recording] when you want to record.
    </p>
    <p
      v-if="state.audioTracks.length === 0"
      class="boxed-text"
    >
      🔇 Your browser isn't sharing sound from your chosen screen or window. If you want to record sound and didn't get an option to do so, you will need to use a browser like Google&nbsp;Chrome or Microsoft&nbsp;Edge.
    </p>
  </MetaText>
</template>

<style>
.boxed-text {
  padding: 4px 8px;
  border: 1px solid black;
  border-radius: 8px;
}
</style>
