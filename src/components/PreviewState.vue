<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { computed, ref, watch } from 'vue';
import type { PreviewState, AnyState, EmptyState, RecordingState } from '@/states';

const props = defineProps<{
  state: PreviewState;
}>();

const emit = defineEmits<{
  setState: [state: AnyState];
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
      const newState: EmptyState = { name: 'EmptyState' };
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
  const newState: EmptyState = { name: 'EmptyState' };
  emit('setState', newState);
};

const startRecording = () => {
  const newState: RecordingState = { name: 'RecordingState', mediaStream: props.state.mediaStream };
  emit('setState', newState);
};

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
        disablepictureinpicture
        :srcObject="props.state.mediaStream"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="stopSharing">
        Stop sharing source
      </StreamUIButton>
      <StreamUIButton @click="startRecording">
        Start recording
      </StreamUIButton>
    </template>
  </InterfaceLayout>
</template>

<style>
</style>
