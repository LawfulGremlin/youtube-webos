// Entry point for fork-only extensions. Each imported module
// self-registers via shortcut-registry. Import this file before any
// module that reads from the registry (config.js, ui.js).

import './frame-step';
