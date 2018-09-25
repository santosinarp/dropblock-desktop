const electron = require('electron')
const url = require('url')
const path = require('path')
const {app, BrowserWindow, Menu, globalShortcut, ipcMain} = electron
require('dotenv').config()

let mainWindow

// Listen for app to be ready
app.on('ready', () => {
    // Create new window
    mainWindow = new BrowserWindow({})

    // Load html file to the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Quit app when closed
    mainWindow.on('close', () => {
        app.quit()
    })

    // Register shortcut
    if(process.platform === 'darwin') {
        globalShortcut.register('Command+Q', () => {
            app.quit()
        })
    }else {
        globalShortcut.register('Ctrl+Q', () => {
            app.quit()
        })
    }

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    // Insert menu
    Menu.setApplicationMenu(mainMenu)

})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
            
        ]
    }
]

// if mac, add empty object for the first menu
if(process.platform === 'darwin') {
    mainMenuTemplate.unshift({})
}

// Add developer tools except in production stage
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
            },
            {
                role: 'reload'
            }
        ]
    })
}
