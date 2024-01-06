<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import { ref, computed, watch } from 'vue';
import { State } from '../states';

const props = defineProps<{
  stream: MediaStream;
}>();

const emit = defineEmits<{
  setState: [state: State];
  setStream: [strean: MediaStream | null];
}>();

const streamLabel = computed(() => {
  const videoTracks = props.stream.getVideoTracks();
  return videoTracks.pop()?.label;
});

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

const stopSharing = () => {
  emit('setStream', null);
  emit('setState', State.Empty);
};

const startRecording = () => {
  emit('setState', State.Recording);
};

</script>

<template>
  <div class="preview-container">
    <div class="preview-ui">
      <StreamUIText>
        {{ streamLabel ?? 'Untitled shared source' }}
      </StreamUIText>
    </div>
    <video
      autoplay
      muted
      :srcObject="stream"
    />
    <div class="preview-ui">
      <StreamUIButton @click="stopSharing">
        Stop sharing source
      </StreamUIButton>
      <StreamUIButton @click="startRecording">
        Start recording
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
</style>
