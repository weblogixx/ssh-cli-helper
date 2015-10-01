#! /usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const detectedPlatform = require('os').platform();

const sshUtils = require('./index');

const argv = require('minimist')(process.argv.slice(2));
const colors = require('colors/safe');
const inquirer = require('inquirer');

// Set default store paths
const dfltPath = path.join(require('os').homedir(), '.ssh-cli-helper');
const dfltFile = path.join(dfltPath, 'store.json');

function help() {

  console.log(`ssh-cli-helper -c [connectionName] -l -f
  Usage:
    [-h, --help] Output this help
    [-a, --add] Add a new connection
    [-c, --connect] [connectionName] Open the ssh conection named connectionName
    [-l, --list] List all available connections
`);
}

let argLength = Object.keys(argv).length;

// Parse the arguments and look what matches
if(argLength <= 1 || argv.h || argv.help) {
  help();
  process.exit(0);
}

// Make sure the default file exists
try {
  fs.accessSync(dfltPath);
} catch(e) {
  fs.mkdirSync(dfltPath);
}

try {
  fs.accessSync(dfltFile);
} catch(e) {
  fs.openSync(dfltFile, 'w');
}

// Initialize the connection store
let store = new sshUtils.ConnectionStore(dfltFile);

// Handle list items
if(argv.l || argv.list) {

  if(!store.storage || store.storage.length === 0) {
    console.log(colors.yellow('Warning! There are no available connections in this store!'));
    console.log(colors.yellow('Please add connections by using ssh-cli-helper -a'));
  } else {

    console.log();

    store.storage.forEach((item) => {

      console.log(colors.green(`Connection: ${item.connectionName}`));
      console.log(colors.white(`User: ${item.userName}`));
      console.log(colors.white(`Host: ${item.hostName}`));
      console.log(colors.white(`Port: ${item.port}`));
      console.log(colors.yellow(`Command: ${item.getCommand(detectedPlatform)}`));
      console.log();
    });
  }

  process.exit(0);
}

// Handle add items
if(argv.a || argv.add) {

  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'connectionName',
        message: 'Please enter a connection name',
        validate: (input) => {
          return input.length > 0;
        }
      },
      {
        type: 'input',
        name: 'userName',
        message: 'Please enter the user name used for connections',
        validate: (input) => {
          return input.length > 0;
        }
      },
      {
        type: 'input',
        name: 'hostName',
        message: 'Please enter the host name used for connections',
        validate: (input) => {
          return input.length > 0;
        }
      },
      {
        type: 'input',
        name: 'port',
        message: 'Please enter the port to connect to',
        default: 22,
        validate: (input) => {
          return !isNaN(input) && input > 1;
        }
      }
    ],
    (answers) => {

      let connection = sshUtils.SSHConnection.fromObject(answers);
      if(store.addConnection(connection) && store.saveDataToStorage(dfltFile)) {

        console.log(colors.green('Successfully written connection to storage!'));
        process.exit(0);
      } else {
        process.exit(1);
      }
    }
  );
}

// Handle connect item
if(argv.c || argv.connect) {

  let connectionName;
  if(argv.c && argv.c.length > 0) {
    connectionName = argv.c;
  } else if(argv.connect || argv.connect.length > 0) {
    connectionName = argv.connect;
  } else {
    connectionName = false;
  }

  if(!connectionName) {
    console.log(colors.yellow('Please provide the connection name as argument. Example: ssh-cli-helper -c MY_CONNECTION'));
    process.exit(1);
  }

  let connection = store.getConnectionByName(connectionName);

  if(!connection) {
    console.log(colors.red('The wanted connection could not be found. Please have a look at ssh-cli-helper -l to list all available connnections'));
    process.exit(1);
  }

  process.exit(0);
}
