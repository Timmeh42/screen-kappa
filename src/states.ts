export type EmptyStateObject = {
  name: 'EmptyState';
};

export type SelectionStateObject = {
  name: 'SelectionState';
};

export type PreviewStateObject = {
  name: 'PreviewState';
  videoTracks: MediaStreamTrack[];
  audioTracks: MediaStreamTrack[];
};

export type RecordingStateObject = {
  name: 'RecordingState';
  videoTracks: MediaStreamTrack[];
  audioTracks: MediaStreamTrack[];
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
