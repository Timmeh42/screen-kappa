<script setup lang="ts">
import { ref } from 'vue';
import EmptyState from './components/EmptyState.vue';
import RecordingState from './components/RecordingState.vue';
import PreviewState from './components/PreviewState.vue';
import { State, type AnyState } from './states';
import SelectionState from './components/SelectionState.vue';
import RecordingThumbnail from './components/RecordingThumbnail.vue';

type Recording = {
  blob: Blob;
  label: string;
  created: number;
  length: number;
};

const state = ref<AnyState>({ name: State.Empty });

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
        v-if="state.name === State.Empty || state.name === State.Error"
        :state="state"
        @set-state="setState"
      />
      <SelectionState
        v-if="state.name === State.Selection"
        :state="state"
        @set-state="setState"
      />
      <PreviewState
        v-if="state.name === State.Preview"
        :state="state"
        @set-state="setState"
      />
      <RecordingState
        v-if="state.name === State.Recording"
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
