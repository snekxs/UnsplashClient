const electron = require("electron");

const {
  PARAMS,
  VALUE,
  MicaBrowserWindow,
  IS_WINDOWS_11,
  WIN10,
} = require("mica-electron");
const path = require("path");

try {
  require("electron-reloader")(module);
} catch (_) {}

electron.app.on("ready", () => {
  const win = new MicaBrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    show: false,

    // frame: false // -> now work, you can remove the frame properly !!
  });

  win.setDarkTheme();
  win.setMicaAcrylicEffect();

  win.loadFile(path.join(__dirname, "index.html"));

  win.webContents.once("dom-ready", () => {
    win.show();
  });
});
