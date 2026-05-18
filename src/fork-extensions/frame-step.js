import { registerShortcutAction, getContext } from './shortcut-registry';

const FRAME_DURATION_SEC = 1 / 30;

function performFrameStep(frames) {
  const video = document.querySelector('video');
  if (!video) return;
  if (!video.paused) video.pause();
  video.currentTime = Math.max(
    0,
    Math.min(video.duration || Infinity, video.currentTime + frames * FRAME_DURATION_SEC)
  );
  const abs = Math.abs(frames);
  const suffix = abs !== 1 ? 's' : '';
  const msg = frames > 0
    ? `►| +${abs} Frame${suffix}`
    : `|◄ -${abs} Frame${suffix}`;
  const { showNotification } = getContext();
  if (showNotification) showNotification(msg, 1000);
}

const stepHandler = (frames) => () => performFrameStep(frames);

registerShortcutAction({ key: 'frame_step_fwd',  label: 'Frame Step Forward',      scope: 'VIDEO', handler: stepHandler(1),   burst: true });
registerShortcutAction({ key: 'frame_step_back', label: 'Frame Step Backward',     scope: 'VIDEO', handler: stepHandler(-1),  burst: true });
registerShortcutAction({ key: 'frame_skip_fwd',  label: 'Skip 15 Frames Forward',  scope: 'VIDEO', handler: stepHandler(15),  burst: true });
registerShortcutAction({ key: 'frame_skip_back', label: 'Skip 15 Frames Backward', scope: 'VIDEO', handler: stepHandler(-15), burst: true });
