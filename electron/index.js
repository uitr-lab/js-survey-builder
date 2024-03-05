const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')


let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 1450,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools();


    // This script will be executed within the Electron renderer process
    // const { ipcRenderer } = require('electron');

    // Button click event listener to open directory dialog
    //document.getElementById('openDirectoryButton').addEventListener('click', 
    //  (async () => {
    //     const { dialog } = require('electron')
    //     console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
    //  })();

    // );
}


app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    console.log('close');
    app.quit()
})


ipcMain.on("requestConfig", (event, args) => {
    win.webContents.send("config", require(path.join(__dirname, "config.json")));
});