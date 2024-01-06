<script setup lang="ts">
import { ref, watch } from 'vue';
import EmptyState from './components/EmptyState.vue';
import RecordingState from './components/RecordingState.vue';
import PreviewState from './components/PreviewState.vue';
import ErrorState from './components/ErrorState.vue';
import { State } from './states';
import SelectionState from './components/SelectionState.vue';

const state = ref<State>(State.Empty);
const error = ref<DOMException | null>(null);
const mediaStream = ref<MediaStream | null>(null);

watch(mediaStream, (newMediaStream, oldMediaStream) => {
  if (newMediaStream === null && oldMediaStream !== null) {
    for (const track of oldMediaStream.getTracks()) {
      track.stop();
    }
  }
});

const setState = (newState: State) => {
  state.value = newState;
};

const setStream = (stream: MediaStream | null) => {
  mediaStream.value = stream;
};

const setError = (newError: DOMException | null) => {
  error.value = newError;
};

</script>

<template>
  <div class="container">
    <div class="center-column">
      <EmptyState
        v-if="state === State.Empty"
        @set-state="setState"
      />
      <SelectionState
        v-if="state === State.Selection"
        @set-state="setState"
        @set-stream="setStream"
        @set-error="setError"
      />
      <PreviewState
        v-if="state === State.Preview"
        :stream="mediaStream"
        @set-state="setState"
        @set-stream="setStream"
      />
      <RecordingState
        v-if="state === State.Recording"
        :stream="mediaStream"
        @set-state="setState"
        @set-stream="setStream"
      />
      <ErrorState
        v-if="state === State.Error"
        :error="error"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center-column {
  padding-top: 40px;
  width: 400px;
}
</style>
