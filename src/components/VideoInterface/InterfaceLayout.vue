<template>
  <div class="preview-container">
    <div class="preview-ui">
      <slot name="header" />
    </div>
    <div class="preview-video">
      <slot name="video">
        <div class="video-placeholder" />
      </slot>
      <div class="video-overlay">
        <div class="video-overlay-content">
          <slot name="video-overlay" />
        </div>
      </div>
    </div>
    <div class="preview-ui">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.preview-ui {
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.preview-ui > * {
  flex-grow: 0;
}

.preview-video {
  position: relative;
  border: 1px solid black;
  border-width: 0 1px;
}

.video-placeholder {
  width: 100%;
  padding-bottom: 60%;
  background-color: black;
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  pointer-events: none;
}

.video-overlay-content:not(:empty) {
  text-align: center;
  color: white;
  background-color: rgba(100, 100, 100, 0.7);
  padding: 8px;
  pointer-events: all;
}
</style>
