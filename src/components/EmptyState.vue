<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';
import StreamUIButton from './StreamUIButton.vue';
import { State } from '../states';

const emit = defineEmits<{
  setState: [state: State];
}>();

const startSelection = () => {
  emit('setState', State.Selection);
};

</script>

<template>
  <div class="preview-container">
    <div class="preview-ui">
      <StreamUIText>
        No source shared
      </StreamUIText>
    </div>
    <div class="video-placeholder" />
    <div class="preview-ui">
      <StreamUIButton @click="startSelection">
        Select/share source
      </StreamUIButton>
    </div>
  </div>
</template>

<style>
.video-placeholder {
  width: 100%;
  padding-bottom: 60%;
  background-color: black;
}

.preview-ui {
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.preview-ui > * {
  flex-grow: 0;
}
</style>
