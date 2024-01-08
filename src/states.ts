export type EmptyStateObject = {
  name: 'EmptyState';
};

export type SelectionStateObject = {
  name: 'SelectionState';
};

export type PreviewStateObject = {
  name: 'PreviewState';
  mediaStream: MediaStream;
};

export type RecordingStateObject = {
  name: 'RecordingState';
  mediaStream: MediaStream;
};

export type EditStateObject = {
  name: 'EditState';
  recording: Recording;
  recordingId: number;
};

export type ErrorStateObject = {
  name: 'ErrorState';
  error: DOMException;
  message: string;
};

export type AnyStateObject = EmptyStateObject | SelectionStateObject | PreviewStateObject | RecordingStateObject | EditStateObject | ErrorStateObject;

export type Recording = {
  blob: Blob;
  label: string;
  created: number;
  length: number;
};
