export type EmptyState = {
  name: 'EmptyState';
};

export type SelectionState = {
  name: 'SelectionState';
};

export type PreviewState = {
  name: 'PreviewState';
  mediaStream: MediaStream;
};

export type RecordingState = {
  name: 'RecordingState';
  mediaStream: MediaStream;
};

export type EditState = {
  name: 'EditState';
  videoBlob: Blob;
  label: string;
};

export type ErrorState = {
  name: 'ErrorState';
  error: DOMException;
  message: string;
};

export type AnyState = EmptyState | SelectionState | PreviewState | RecordingState | EditState | ErrorState;

export type Recording = {
  blob: Blob;
  label: string;
  created: number;
  length: number;
};
