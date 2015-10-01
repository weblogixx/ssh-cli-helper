'use strict';
const SSHCommand = require('./sshcommand');

const DFLT_SSH_PORT = 22;

/**
 * Generic class for a single ssh connection
 */
class SSHConnection {

  /**
   * [constructor description]
   * @param {String} connectionName The connections internal name
   * @param {String} userName The user name to connect with
   * @param {String} hostName The host to connect to
   * @param {Number} port     The port to connect to, defaults to 22 [optional]
   */
  constructor(connectionName, userName, hostName, port) {
    this.connectionName = connectionName;
    this.userName = userName;
    this.hostName = hostName;
    this.port = !port ? DFLT_SSH_PORT : port;
  }

  /**
   * Set the connections name
   * @param {String} connectionName The new connections name
   * @throws Error If the userName is invalid
   * @return SSHConnection
   */
  setConnectionName(connectionName) {

    if(!connectionName || connectionName.length === 0) {
      throw new Error('SSHConnection: Invalid connectionName supplied!');
    }

    this.connectionName = connectionName;
    return this;
  }

  /**
   * Set the users name
   * @param {String} userName The new userName
   * @throws Error If the userName is invalid
   * @return SSHConnection
   */
  setUserName(userName) {

    if(!userName || userName.length === 0) {
      throw new Error('SSHConnection: Invalid userName supplied!');
    }

    this.userName = userName;
    return this;
  }

  /**
   * Set the hosts name
   * @param {String} hostName The new host
   * @throws Error If the hostName is invalid
   * @return SSHConnection
   */
  setHostName(hostName) {

    if(!hostName || hostName.length === 0) {
      throw new Error('SSHConnection: Invalid hostName supplied!');
    }

    this.hostName = hostName;
    return this;
  }

  /**
   * Set the hosts port
   * @param {Number} port The new port
   * @throws Error If the port is invalid
   * @return SSHConnection
   */
  setPort(port) {

    if(!port || isNaN(port)) {
      throw new Error('SSHConnection: Invalid port supplied!');
    }

    this.port = port;
    return this;
  }

  /**
   * Get the command for the wanted platform
   * @param  {String} platform
   * @return {String}
   */
  getCommand(platform) {
    return new SSHCommand(this, platform).toString();
  }

  /**
   * Export the entity to object
   * @return {Object}
   */
  toObject() {
    return {
      connectionName: this.connectionName,
      userName: this.userName,
      hostName: this.hostName,
      port: this.port
    };
  }

  /**
   * Create a new ssh connection from object parameters
   * @param {Object} data The data to
   * @return {SSHConnection} The new ssh connection
   */
  static fromObject(data) {

    let requiredFields = [ 'connectionName', 'userName', 'hostName' ];

    for(let f in requiredFields) {
      if(data[requiredFields[f]] === undefined) {
        throw new Error(`Error generating a ssh connection from object: Missing field ${requiredFields[f]}`);
      }
    }

    return new SSHConnection(data.connectionName, data.userName, data.hostName, data.port);
  }

}

module.exports = SSHConnection;
