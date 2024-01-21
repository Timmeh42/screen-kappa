<script setup lang="ts">
import { ref } from 'vue';
import EmptyState from './states/EmptyState.vue';
import RecordingState from './states/RecordingState.vue';
import PreviewState from './states/PreviewState.vue';
import SelectionState from './states/SelectionState.vue';
import EditState from './states/EditState.vue';
import RecordingThumbnail from './components/RecordingThumbnail.vue';
import type { AnyStateObject, EditStateObject, Recording } from './states';

const state = ref<AnyStateObject>({ name: 'EmptyState' });

const stateComponents = {
  EmptyState,
  RecordingState,
  PreviewState,
  SelectionState,
  EditState,
  ErrorState: EmptyState,
};

const recordings = ref<Recording[]>([]);

const setState = (newState: AnyStateObject) => {
  state.value = newState;
};

const addRecording = (newRecording: Recording) => {
  recordings.value.unshift(newRecording);
};

const deleteRecording = (recordingId: number) => {
  recordings.value.splice(recordingId, 1);
};

const updateRecording = (recordingId: number, recording: Recording) => {
  recordings.value.splice(recordingId, 1, recording);
};

const loadRecording = (recordingId: number) => {
  const newState: EditStateObject = { name: 'EditState', recording: recordings.value[recordingId], recordingId: recordingId };
  setState(newState);
};

</script>

<template>
  <div class="container">
    <div class="side-column" />
    <div class="main-column">
      <component
        :is="stateComponents[state.name]"
        :state="state"
        @set-state="setState"
        @delete-recording="deleteRecording"
        @update-recording="updateRecording"
        @recording-complete="addRecording"
      />
    </div>
    <div class="side-column">
      <RecordingThumbnail
        v-for="recording, i of recordings"
        :key="i"
        :recording="recording"
        @click="loadRecording(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1400px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  padding-top: 2.5rem;
}

.main-column {
  width: 60%;
  flex-grow: 0;
}

.side-column {
  width: 20%;
  flex-grow: 0;
}
</style>
