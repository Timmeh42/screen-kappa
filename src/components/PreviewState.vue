<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import InterfaceLayout from './VideoInterface/InterfaceLayout.vue';
import { computed } from 'vue';
import { State, type PreviewState, type EmptyState, type RecordingState, type AnyState } from '../states';

const props = defineProps<{
  state: PreviewState;
}>();

const emit = defineEmits<{
  setState: [state: AnyState];
}>();

if (props.state.mediaStream.getTracks().every((track) => track.readyState === 'ended')) {
  const newState: EmptyState = { name: State.Empty };
  emit('setState', newState);
}

const streamLabel = computed(() => {
  const videoTracks = props.state.mediaStream.getVideoTracks();
  return videoTracks.pop()?.label;
});

const stopSharing = () => {
  for (const track of props.state.mediaStream.getTracks()) {
    track.stop();
  }
  const newState: EmptyState = { name: State.Empty };
  emit('setState', newState);
};

const startRecording = () => {
  const newState: RecordingState = { name: State.Recording, mediaStream: props.state.mediaStream };
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
.preview-ui {
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.preview-ui > * {
  flex-grow: 0;
}
</style>
