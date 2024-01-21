<script setup lang="ts">
import type { Recording } from '@/states';
import { computed, ref } from 'vue';

const props = defineProps<{
  recording: Recording;
}>();

let playing = false;

const videoElement = ref<HTMLVideoElement | null>(null);

const videoSource = computed(() => URL.createObjectURL(props.recording.blob));

const lengthDisplay = computed(() => {
  const dateObject = new Date(props.recording.length);
  const minutes = dateObject.getMinutes().toString();
  const seconds = dateObject
    .getSeconds()
    .toString()
    .padStart(2, '0')
  ;
  return `${minutes}:${seconds}`;
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
    <div class="thumbnail-filler" />
    <video
      ref="videoElement"
      class="thumbnail-video"
      disablePictureInPicture
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
  margin: 0 1rem 1rem;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid black;

  &:hover {
    border-color: red;
  }
}

.thumbnail-video {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
}

.thumbnail-filler {
  padding-bottom: 60%;
  background-color: black;
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
