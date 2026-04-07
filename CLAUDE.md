# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LuckyGame is a browser-based game framework and collection built with vanilla JavaScript (ES6 classes) and HTML5 Canvas. It has zero external dependencies and requires no build step. Live at: https://luckyk255.github.io/LuckyGame/game.html

## Running the Project

```bash
# Serve locally
python3 -m http.server 8000
# Then open http://localhost:8000/game.html
```

No build, bundler, or package manager is used. Open `game.html` directly or via a local server.

## Testing

There is no test framework. `test.js` contains manual test functions callable from the browser console:
```js
test()
test_arrowFunction()
```

Debug controls (already enabled in `main.js`): press **P** to pause, **1–9** to select levels. An FPS slider and config parameter sliders are in the HTML UI.

## Architecture

The project is split into a reusable framework layer (`luckyGame/`) and game-specific scene/object code (`scene/`).

### Core Framework (`luckyGame/`)

| File | Responsibility |
|------|----------------|
| `lucky_game.js` | Singleton `Game` class: image preloading, game loop (`runloop`), scene management, event handling |
| `lucky_scene.js` | Base `LuckyScene` class for all scenes |
| `lucky_image.js` | Base `LuckyImage` class; subclasses include `Player`, `Enemy`, `Bullet`, `Background` |
| `lucky_animation.js` | Frame-based animation; `Hero` and `Bird` classes |
| `lucky_particle.js` | `LuckyParticleSystem` and `Particle` for visual effects |
| `lucky_label.js` | Canvas text/label rendering |
| `utils.js` | Logging helpers, rectangle collision detection, debug mode toggle |

### Game Scenes (`scene/`)

- `scene/title/scene_title.js` — Title screen with `Ground` class
- `scene/main/scene.js` — Active Flappy Bird scene (`Pipes`, `Score` singletons)
- `scene/main/ball.js`, `paddle.js`, `block.js` — Breakout game objects
- `scene/end/scene_end.js` — Game over screen
- `scene/editor/scene_editor.js` — Level editor

### Other Key Files

- `config.js` — Runtime-tunable game parameters (pipe spacing, etc.) with double-binding to HTML sliders
- `level/level.js` — 6 block-breaking levels; exposes `window.levels`
- `main.js` — Entry point: instantiates `Game`, loads images, starts scene flow
- `game.html` — Canvas (450×520), UI controls, and `<script>` loading order

### Script Loading Order (must not change)

`game.html` loads scripts in dependency order:
1. `utils.js` → `lucky_game.js` → `lucky_label.js` → `lucky_scene.js` → `lucky_image.js` → `lucky_particle.js` → `lucky_animation.js`
2. `ball.js` → `paddle.js` → `block.js` → `scene.js` → `scene_end.js` → `scene_title.js`
3. `level/level.js` → `config.js` → `main.js` → `test.js`

### Key Patterns

- **Singleton**: `Game.singleInstance(fps, images, callback)`, `Score.singleInstance(game)`
- **Scene transitions**: call `replaceScene(newScene)` to switch scenes
- **Input**: register keyboard/mouse actions via `registerAction(key, callback)`
- **Config double-binding**: `config.js` values are bound to HTML range/number inputs at runtime for live tuning
