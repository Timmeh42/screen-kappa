<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { computed, ref, watch } from 'vue';
import type { PreviewStateObject, AnyStateObject, EmptyStateObject, RecordingStateObject } from '@/states';
import MetaText from './MetaText.vue';
import StreamUIToggle from './StreamUIToggle.vue';

const props = defineProps<{
  state: PreviewStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
}>();

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
      const newState: EmptyStateObject = { name: 'EmptyState' };
      emit('setState', newState);
    }
  },
  { immediate: true },
);

const streamLabel = computed(() => {
  const videoTracks = props.state.mediaStream.getVideoTracks();
  return videoTracks.pop()?.label;
});

const stopSharing = () => {
  // stopping the tracks notifies the browser that the screen is no longer being shared
  for (const track of props.state.mediaStream.getTracks()) {
    track.stop();
  }
  const newState: EmptyStateObject = { name: 'EmptyState' };
  emit('setState', newState);
};

const startRecording = () => {
  const newState: RecordingStateObject = { name: 'RecordingState', mediaStream: props.state.mediaStream };
  emit('setState', newState);
};

const useMic = ref(false);
const micTrack = ref<MediaStreamTrack>();
watch(useMic, (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((microphoneStream: MediaStream) => {
        micTrack.value = microphoneStream.getAudioTracks()[0];
        const audioTracks = microphoneStream.getAudioTracks();
        for (const audioTrack of audioTracks) {
          props.state.mediaStream.addTrack(audioTrack);
        }
      })
      .catch(() => {
        useMic.value = false;
      });
  }
  if (newValue === false && oldValue === true) {
    for (const audioTrack of props.state.mediaStream.getAudioTracks()) {
      if (audioTrack.id === micTrack.value?.id) {
        props.state.mediaStream.removeTrack(audioTrack);
      }
    }
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
        :srcObject="props.state.mediaStream"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="stopSharing">
        🚫 Stop sharing source
      </StreamUIButton>
      <StreamUIToggle
        v-model="useMic"
        :labels="['no', 'yes']"
      >
        Record microphone?
      </StreamUIToggle>
      <StreamUIButton @click="startRecording">
        🎬 Start recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      Now you can preview what you are sharing, before recording.
    </p>
    <p>
      To start, press the [Select/share source] button to choose a window or screen to record from, just like sharing your screen on a video call.
    </p>
  </MetaText>
</template>

<style>
</style>
