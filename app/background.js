//!
//! @file               background.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-12-06
//! @brief              Entry point for javascript code. Contains the background process.
//! @details
//!     See README.rst in repo root dir for more info.

// This is main process of Electron, started as first thing when the Electron
// app starts, and running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var mainWindow;

// Preserver of the window size and position between app launches.
/*
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});*/

var mainWindowState;

app.on('ready', function () {

    // Get the size of the primary display so we can set defaults for the
    // main window size
    // Note: This must be required after app is ready
    var electronScreen = require('screen');
    var size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Preserver of the window size and position between app launches.
    var mainWindowState = windowStateKeeper('main', {
        width: size.width,
        height: size.height
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    //mainWindow.webContent.appRoot = 'blah';

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadUrl('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadUrl('file://' + __dirname + '/app.html');
    }

    if (env.name !== 'production') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
