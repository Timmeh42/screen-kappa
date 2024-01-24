<script setup lang="ts">
import StreamUIButton from '../components/StreamUIButton.vue';
import StreamUITextBox from '../components/StreamUITextBox.vue';
import InterfaceLayout from '../components/InterfaceLayout.vue';
import MetaText from '../components/MetaText.vue';
import type { EditStateObject, AnyStateObject, EmptyStateObject, Recording } from '@/states';
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  state: EditStateObject;
}>();

const emit = defineEmits<{
  setState: [state: AnyStateObject];
  deleteRecording: [recordingId: number];
  updateRecording: [recordingId: number, recording: Recording];
}>();

const clonedRecording = reactive({ ...props.state.recording });

const videoSource = computed(() => URL.createObjectURL(props.state.recording.blob));

const doneEditing = () => {
  const newState: EmptyStateObject = { name: 'EmptyState' };
  emit('setState', newState);
};

const deleteRecording = () => {
  emit('deleteRecording', props.state.recordingId);
  doneEditing();
};

const updateRecording = () => {
  emit('updateRecording', props.state.recordingId, clonedRecording);
};
watch(clonedRecording, updateRecording);

const saveDownload = () => {
  const a = document.createElement('a');
  const videoURL = URL.createObjectURL(clonedRecording.blob);
  a.href = videoURL;
  a.download = `${clonedRecording.label}.webm`;
  a.click();
};

</script>

<template>
  <InterfaceLayout>
    <template #header>
      <StreamUITextBox
        v-model="clonedRecording.label"
      />
      <StreamUIButton @click="saveDownload">
        📥 Save to file
      </StreamUIButton>
    </template>
    <template #video>
      <video
        disablepictureinpicture
        controls
        :src="videoSource"
      />
    </template>
    <template #footer>
      <StreamUIButton @click="deleteRecording">
        ❌ Delete
      </StreamUIButton>
      <StreamUIButton @click="doneEditing">
        👍 Done
      </StreamUIButton>
    </template>
  </InterfaceLayout>
  <MetaText>
    <p>
      Your recording has been finished. You can now replay it to review it, and you can edit the it's name in the text box above the video.
    </p>
    <p>
      Make sure to press [Save to file] to download the recording to your computer.
    </p>
    <p>
      If you are unsatisfied, you can [Delete] it and start again, or press [Done] to add it to the list of recordings from this session.
      You can click on a previous recording on the right to go back to it for watching or downloading.
    </p>
  </MetaText>
</template>

<style>
</style>
