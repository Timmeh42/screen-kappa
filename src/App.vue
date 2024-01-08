<script setup lang="ts">
import { ref } from 'vue';
import EmptyState from './components/EmptyState.vue';
import RecordingState from './components/RecordingState.vue';
import PreviewState from './components/PreviewState.vue';
import SelectionState from './components/SelectionState.vue';
import RecordingThumbnail from './components/RecordingThumbnail.vue';
import type { AnyState, Recording } from './states';

const state = ref<AnyState>({ name: 'EmptyState' });

const recordings = ref<Recording[]>([]);

const setState = (newState: AnyState) => {
  state.value = newState;
};

const addRecording = (newRecording: Recording) => {
  recordings.value.push(newRecording);
};

</script>

<template>
  <div class="container">
    <div class="side-column" />
    <div class="main-column">
      <EmptyState
        v-if="state.name === 'EmptyState' || state.name === 'ErrorState'"
        :state="state"
        @set-state="setState"
      />
      <SelectionState
        v-if="state.name === 'SelectionState'"
        :state="state"
        @set-state="setState"
      />
      <PreviewState
        v-if="state.name === 'PreviewState'"
        :state="state"
        @set-state="setState"
      />
      <RecordingState
        v-if="state.name === 'RecordingState'"
        :state="state"
        @set-state="setState"
        @recording-complete="addRecording"
      />
    </div>
    <div class="side-column">
      <RecordingThumbnail
        v-for="recording, i of recordings"
        :key="i"
        :recording="recording"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  padding-top: 40px;
}

.main-column {
  width: 400px;
  flex-grow: 0;
}

.side-column {
  width: 200px;
  flex-grow: 0;
}
</style>
