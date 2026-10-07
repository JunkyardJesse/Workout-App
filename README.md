# Lift Log

A simple single-page workout tracker for iPhone (no build step, no dependencies).

- Home: one block per lift (Bench Press, Squat, Deadlift, Overhead Press, Dumbbell Rows)
- Lift screen: progress graph, weight input (lbs), five set boxes
- Each box counts 0→5 per tap and restarts a rest timer at 0:00; at 3:00 it beeps, vibrates (where supported) and shows a banner
- All five boxes at 5 saves the weight to history (stored on-device in localStorage)
- Home → "Import / export data": paste `exercise, date, weight` lines to load past workouts, or export a backup

## Run / install on iPhone
Host the folder on any static host (e.g. GitHub Pages), open it in Safari, then Share → Add to Home Screen.

Locally: `python3 -m http.server 8000` and open http://localhost:8000.

Notes: iOS Safari pauses timers and audio when the screen locks, so keep the app open; the timer catches up when you return. `navigator.vibrate` is not supported on iOS, so the alert there is sound + banner.
