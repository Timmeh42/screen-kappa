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
.preview-container {
  border: 1px solid black;
}

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
}

.video-overlay-content:not(:empty) {
  text-align: center;
  color: white;
  background-color: rgba(100, 100, 100, 0.7);
  padding: 8px;
}
</style>
