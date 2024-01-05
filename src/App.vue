<script setup lang="ts">
import { ref } from 'vue';

function assertIsDefined<T> (value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined but found ${value}`);
  }
}

const videoDisplayElement = ref<HTMLVideoElement | null>(null);
let videoDisplayStream: MediaStream | null = null;
const streaming = ref(false);
const recording = ref(false);
let recordedChunks: Blob[] = [];
let mediaRecorder: MediaRecorder | null = null;


const requestStream = () => {
  if (streaming.value === true) {
    return;
  }
  navigator.mediaDevices
    .getDisplayMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      streaming.value = true;
      for (const streamTrack of stream.getTracks()) {
        streamTrack.addEventListener('ended', onStreamStopped);
      }
      videoDisplayStream = stream;
      if (videoDisplayElement.value !== null) {
        videoDisplayElement.value.srcObject = stream;
        videoDisplayElement.value.play();
      }
    })
    .catch(() => {
      // rejected or some other error
      window.location.reload();
    })
  ;
};

const onStreamStopped = () => {
  if (videoDisplayStream === null) return;

  const allStreamsStopped = videoDisplayStream
    .getTracks()
    .every((track) => track.readyState === 'ended')
  ;

  if (allStreamsStopped === true) {
    stopStream();
  }
};

const stopStream = () => {
  if (streaming.value === false) {
    return;
  }

  if (videoDisplayStream !== null) {
    for (const track of videoDisplayStream.getTracks()) {
      track.stop();
    }
    videoDisplayStream = null;
  }

  streaming.value = false;
};

const startRecording = () => {
  assertIsDefined(videoDisplayStream);

  mediaRecorder = new MediaRecorder(videoDisplayStream, {
    mimeType: 'video/webm;codecs=vp8',
  });

  mediaRecorder.start();
  mediaRecorder.ondataavailable = (blobEvent) => {
    recordedChunks.push(blobEvent.data);
  };

  mediaRecorder.onstop = () => {
    assertIsDefined(videoDisplayElement.value);
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm;codecs=vp8' });
    videoDisplayElement.value.srcObject = null;
    videoDisplayElement.value.src = URL.createObjectURL(videoBlob);
    videoDisplayElement.value.controls = true;
    console.log({ recordedChunks, url: videoDisplayElement.value.src });
  };

  recording.value = true;
};

const stopRecording = () => {
  assertIsDefined(mediaRecorder);

  mediaRecorder.stop();
  recording.value = false;
};

const resetStream = () => {
  stopStream();

  if (videoDisplayElement.value !== null) {
    videoDisplayElement.value.srcObject = null;
    videoDisplayElement.value.controls = false;
    videoDisplayElement.value.src = '';
  }

  recordedChunks = [];
};

</script>

<template>
  <div>
    <video
      ref="videoDisplayElement"
      disable-picture-in-picture
    />
    <div>
      <button
        v-if="streaming === false"
        @click="requestStream"
      >
        Preview
      </button>
      <button
        v-if="streaming === true"
        @click="stopStream"
      >
        Stop preview
      </button>
      <button
        v-if="streaming === true && recording === false"
        @click="startRecording"
      >
        Record
      </button>
      <button
        v-if="streaming === true && recording === true"
        @click="stopRecording"
      >
        Stop recording
      </button>
      <button
        v-if="videoDisplayElement?.srcObject !== null"
        @click="resetStream"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
video {
  width: 400px;
}
</style>
