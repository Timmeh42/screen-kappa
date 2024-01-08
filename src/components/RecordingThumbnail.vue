<script setup lang="ts">
import { computed, ref } from 'vue';

type Recording = {
  blob: Blob;
  label: string;
  created: number;
  length: number;
  thumbnail: string;
};

const props = defineProps<{
  recording: Recording;
}>();

let playing = false;

const videoElement = ref<HTMLVideoElement | null>(null);

const videoSource = computed(() => URL.createObjectURL(props.recording.blob));

const lengthDisplay = computed(() => {
  const dateObject = new Date(props.recording.length);
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  return `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
});

const mouseOver = () => {
  if (playing === false) {
    if (videoElement.value !== null) {
      videoElement.value.currentTime = 0;
      videoElement.value.play();
      playing = true;
    }
  }
};

const mouseLeave = () => {
  if (videoElement.value !== null) {
    videoElement.value.pause();
    playing = false;
  }
};

</script>

<template>
  <div class="thumbnail-container">
    <video
      ref="videoElement"
      disablepictureinpicture
      :src="videoSource"
      @mouseover="mouseOver"
      @mouseleave="mouseLeave"
    />
    <span class="thumbnail-ui thumbnail-ui-NW">{{ recording.label }}</span>
    <span class="thumbnail-ui thumbnail-ui-SE">{{ lengthDisplay }}</span>
  </div>
</template>

<style lang="scss">
.thumbnail-container {
  margin: 16px;
  position: relative;
}

.thumbnail-ui {
  position: absolute;
  display: inline-block;
  color: white;
  background-color: rgba(100, 100, 100, 0.7);
  padding: 2px;

  &-SE {
    bottom: 0;
    right: 0;
  }

  &-NW {
    top: 0;
    left: 0;
  }
}
</style>
