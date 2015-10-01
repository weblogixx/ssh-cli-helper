'use strict';
const jsonfile = require('jsonfile');
const SSHConnection = require('./sshconnection');

/**
 * Application connection store, used to store connections into the filesystem
 */
class ConnectionStore {

  /**
   * Create a new store.
   * If a filename is provided, load connections from it
   * @param  {String} fileName [optional]
   */
  constructor(fileName) {

    if(fileName !== undefined) {
      this.storage = ConnectionStore.getDataFromStorage(fileName);
    } else {
      this.storage = [];
    }
  }

  /**
   * Get a given connection by name
   * @param  {String} name
   * @return {SSHConnection|false}
   */
  getConnectionByName(name) {

    let filtered = this.storage.filter((item) => {
      return item.connectionName === name;
    });

    return filtered.length > 0 ? filtered[0] : false;
  }

  /**
   * Add a new connection
   * @param {SSHConnection} connection
   * @return {Boolean}
   */
  addConnection(connection) {

    if(connection instanceof SSHConnection === false) {
      return false;
    }

    this.storage.push(connection);
    return true;
  }

  /**
   * Remove a connection either by connection object or storage index
   * @param  {SSHConnection|Number} SSHConnection object or index in storage
   * @return {Boolean}
   */
  removeConnection(connection) {

    if(connection instanceof SSHConnection === false && isNaN(connection)) {
      throw new Error('Please provide either a SSHConnection or a numerical index');
    }

    let index = -1;

    if(!isNaN(connection)) {
      if(this.storage[connection] !== undefined) {
        index = connection;
      }
    } else {
      index = this.storage.indexOf(connection);
    }

    if(index >= 0) {
      this.storage.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Save the data to the given file
   * @param  {String} fileName File to save data to
   * @return {Boolean}
   */
  saveDataToStorage(fileName) {

    try {
      jsonfile.writeFileSync(fileName, this.storage, {
        spaces: 2
      });
      return true;
    } catch(e) {
      return false;
    }
  }

  /**
   * Get available data from a storage file
   * @param  {String} fileName The file to read. Must be a json file
   * @return {Array}
   */
  static getDataFromStorage(fileName) {

    let content;

    try {
      content = jsonfile.readFileSync(fileName);
    } catch(e) {
      return [];
    }

    return content.map((item) => {
      return SSHConnection.fromObject(item);
    });
  }
}

module.exports = ConnectionStore;
