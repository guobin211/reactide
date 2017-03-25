const {ipcMain, BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const deleteItem = require('../lib/delete-directory');

function simulator(root) {
  let spawn = exec('webpack-dev-server --inline --content-base ./public', {
    cwd: path.join(__dirname, '../lib/temp/new-project')
  }, (err, stdout, stderr) => {
    let child = new BrowserWindow({
      width: 800,
      height: 600
    });
    child.loadURL('file://' + path.join(__dirname, '../lib/temp/new-project/client/public/index.html'));
    child.toggleDevTools();
  })
}

module.exports = () => {
  ipcMain.on('openSimulator', (event, root) => {
    simulator(root);
  })
  ipcMain.on('createItem', (event, dirPath, name, type) => {
    if (type === 'file') {
      fs.writeFile(path.join(dirPath, name), '', (err) => {
        if (err) console.log(err);
      })
    } else {
      fs.mkdir(path.join(dirPath, name), (err) => {
        if (err) console.log(err);
      })
    }
  })
  ipcMain.on('delete', (event, itemPath) => {
    deleteItem(itemPath);
  })
  ipcMain.on('rename', (event, itemPath, newName) => {
    console.log(itemPath, path.join(path.dirname(itemPath),newName));
    fs.rename(itemPath, path.join(path.dirname(itemPath), newName));
  })
}