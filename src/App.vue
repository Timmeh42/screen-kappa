<script setup lang="ts">
import { ref } from 'vue';
import EmptyState from './components/EmptyState.vue';
import RecordingState from './components/RecordingState.vue';
import PreviewState from './components/PreviewState.vue';
import SelectionState from './components/SelectionState.vue';
import EditState from './components/EditState.vue';
import RecordingThumbnail from './components/RecordingThumbnail.vue';
import type { AnyStateObject, EditStateObject, Recording } from './states';

const state = ref<AnyStateObject>({ name: 'EmptyState' });

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
      <EditState
        v-if="state.name === 'EditState'"
        :state="state"
        @set-state="setState"
        @delete-recording="deleteRecording"
        @update-recording="updateRecording"
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
