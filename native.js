// Small bridge to native features when running inside the App Store / Google Play app.
// In a normal browser window.Capacitor is absent and every helper is a no-op (or returns false),
// so the web version keeps working exactly as before.
(function () {
  var cap = window.Capacitor;
  var isNative = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var P = (cap && cap.Plugins) || {};
  var REST_ID = 1;
  var asked = false;

  function quiet(p) { if (p && p.catch) p.catch(function () {}); }

  // Rest-timer alert that still fires when the phone is locked or the app is in the background.
  function scheduleRestAlert(atMs) {
    if (!isNative || !P.LocalNotifications) return;
    var LN = P.LocalNotifications;
    var go = function () {
      return LN.cancel({ notifications: [{ id: REST_ID }] }).catch(function () {}).then(function () {
        return LN.schedule({ notifications: [{
          id: REST_ID,
          title: "Rest complete",
          body: "3 minutes up — time for your next set!",
          schedule: { at: new Date(atMs), allowWhileIdle: true }
        }] });
      });
    };
    if (asked) { quiet(go()); return; }
    asked = true;  // ask for permission the first time a timer starts
    quiet(LN.requestPermissions().then(go));
  }
  function cancelRestAlert() {
    if (!isNative || !P.LocalNotifications) return;
    quiet(P.LocalNotifications.cancel({ notifications: [{ id: REST_ID }] }));
  }

  function tap() { if (isNative && P.Haptics) quiet(P.Haptics.impact({ style: "LIGHT" })); }
  function buzz() { if (isNative && P.Haptics) quiet(P.Haptics.vibrate({ duration: 600 })); }

  // Save a text file and open the share sheet (Files, Drive, email…).
  // Returns a promise of true when handled natively; false means use the web fallback.
  function shareTextFile(name, text, title) {
    if (!isNative || !P.Filesystem || !P.Share) return Promise.resolve(false);
    return P.Filesystem.writeFile({ path: name, data: text, directory: "CACHE", encoding: "utf8" })
      .then(function (res) { return P.Share.share({ title: title || name, files: [res.uri] }).catch(function () {}); })
      .then(function () { return true; });
  }

  window.NativeApp = {
    isNative: isNative,
    scheduleRestAlert: scheduleRestAlert,
    cancelRestAlert: cancelRestAlert,
    tap: tap,
    buzz: buzz,
    shareTextFile: shareTextFile
  };
})();
