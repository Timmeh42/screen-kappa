export enum State {
  Empty,
  Error,
  Selection,
  Preview,
  Recording,
  Edit,
}

export type EmptyState = {
  name: State.Empty;
};

export type SelectionState = {
  name: State.Selection;
};

export type PreviewState = {
  name: State.Preview;
  mediaStream: MediaStream;
};

export type RecordingState = {
  name: State.Recording;
  mediaStream: MediaStream;
};

export type EditState = {
  name: State.Edit;
  videoBlob: Blob;
  label: string;
};

export type ErrorState = {
  name: State.Error;
  error: DOMException;
  message: string;
};

export type AnyState = EmptyState | SelectionState | PreviewState | RecordingState | EditState | ErrorState;
