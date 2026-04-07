# Repository Guidelines

## Project Structure & Module Organization
LuckyGame is a vanilla JavaScript, HTML5 Canvas game project with no package manager or build step. The entry page is `game.html`, which loads scripts in dependency order and defines the canvas/UI controls. Core reusable engine code lives in `luckyGame/`, including the game loop, scene base class, images, labels, particles, animations, and utilities. Game-specific code lives in `scene/`: `scene/main/` contains Breakout/Flappy-style objects and scene logic, `scene/title/` and `scene/end/` contain menu/end screens, `scene/editor/` contains editor code, and `scene/pvz/` contains the PvZ-style game implementation. Runtime configuration is in `config.js`, levels are in `level/level.js`, assets are in `img/`, and manual browser tests are in `test.js`.

## Build, Test, and Development Commands
There is no build command. Serve the repository root locally when browser module/file access is needed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/game.html`. You can also open `game.html` directly for quick checks. Use browser devtools for console output and runtime errors.

## Coding Style & Naming Conventions
Use the existing ES5/ES6 hybrid style: `var` declarations, constructor/helper functions such as `ScenePvZ.new(game)`, and classes where the surrounding module already uses them. Preserve 4-space indentation and keep semicolons omitted to match current files. Use descriptive lower_snake_case for files (`lucky_game.js`, `scene_pvz.js`) and PascalCase for class-like constructors (`Game`, `LuckyScene`, `PlantBase`). Keep `game.html` script order consistent with dependencies; add new scripts after their prerequisites and before consumers.

## Testing Guidelines
No automated test framework is configured. `test.js` exposes manual console functions such as `test()` and `test_arrowFunction()`. For behavior changes, run the game in a browser, check devtools for errors, and exercise relevant controls. Debug mode is enabled from `main.js`; use `P` to pause and number keys where supported by the active scene.

## Commit & Pull Request Guidelines
Recent history uses short, imperative messages such as `Update README.md` and `Initial commit`; follow concise subject lines that describe the change. Pull requests should include a brief summary, manual test steps, affected scenes or assets, and screenshots/GIFs for visible gameplay or UI changes. Link issues when applicable and call out changes to `game.html` script ordering or shared engine files.

## Agent-Specific Instructions
Do not introduce npm tooling, bundlers, or formatters unless explicitly requested. Avoid reverting unrelated local changes. When modifying engine code in `luckyGame/`, manually test at least one scene that depends on it.
