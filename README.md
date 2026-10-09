# Lift Log

A simple single-page workout tracker for iPhone (no build step, no dependencies).

- Home: one block per lift (Bench Press, Squat, Deadlift, Overhead Press, Dumbbell Rows)
- Lift screen: progress graph, weight input (lbs), five set boxes
- Each box counts 0→5 per tap and restarts a rest timer at 0:00; at 3:00 it beeps, vibrates (where supported) and shows a banner
- All five boxes at 5 saves the weight to history (stored on-device in localStorage)
- Graph: y axis ticks are multiples of 5 lbs; x axis is a real date axis you can pinch to zoom and drag to pan (Reset zoom button)
- Weight moves in 5 lb steps (− / + buttons; typed values snap to the nearest 5) and a plate diagram shows plates per side on a 45 lb bar (45, 25, 15, 10, 5, 2.5)
- Home → "Import / export data": paste `exercise, date, weight` lines to load past workouts, or export a backup
- Home → "+ Add workout" creates a custom lift with the same layout (graph, weight, plates, 5 set boxes, timer); custom lifts can be removed from their own screen
- Storage: asks the browser for persistent storage, mirrors data to IndexedDB (auto-restores if localStorage is cleared), and "Save backup file" shares a CSV backup

## Run / install on iPhone
Host the folder on any static host (e.g. GitHub Pages), open it in Safari, then Share → Add to Home Screen.

Locally: `python3 -m http.server 8000` and open http://localhost:8000.

Notes: iOS Safari pauses timers and audio when the screen locks, so keep the app open; the timer catches up when you return. `navigator.vibrate` is not supported on iOS, so the alert there is sound + banner.

## iOS and Android apps

The same web app is packaged for the App Store and Google Play with [Capacitor](https://capacitorjs.com). The website keeps working as before; the app build copies the web files into `www/` and wraps them.

- `capacitor.config.json` holds the app ID and name; `assets/` holds the app icon and splash screen sources.
- `native.js` adds app-only features and does nothing in a normal browser.
- `privacy.html` is the privacy policy that both stores ask for. Link it from GitHub Pages.
- **GitHub Actions** (`.github/workflows/app-builds.yml`) builds both apps on every push, with no Mac needed. Download the Android test APK from the run's *Artifacts*. To make store builds, add the signing secrets listed at the top of the workflow, then run it from the Actions tab with **release** ticked.

To build locally, run `npm install` and then `bash scripts/native-setup.sh all`. After that, `npx cap open ios` or `npx cap open android` opens the project. iOS needs a Mac with Xcode.

In the app version, the rest timer also sends a notification at 3:00 when the phone is locked or the app is in the background, and the set boxes give haptic feedback.
