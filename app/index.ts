import { app, BrowserWindow, MenuItemConstructorOptions, MenuItem } from "electron";
import { createTray } from "./services";
import createMainWindow from "./main-window";

let mainWindow: BrowserWindow;
app.on("ready", () => {
    mainWindow = createMainWindow();
    createTray(mainWindow, app);
});

const mainMenuTemplate: MenuItemConstructorOptions[] = [];

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Developer tools",
            click (item: MenuItem, focusedWindow: BrowserWindow) {
                focusedWindow.webContents.openDevTools();
            }
        },
        {
            label: "Reload",
            click (item: MenuItem, focusedWindow: BrowserWindow) {
                focusedWindow.reload();
            }
        }
    );
}
