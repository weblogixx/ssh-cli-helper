'use strict';

const OS_TYPE_LINUX = 'linux';
const OS_TYPE_MAC = 'darwin';
const OS_TYPE_WIN = 'win32';

/**
 * Class for ssh commands
 */
class SSHCommand {

  /**
   * Create a new ssh command
   * @param  {SSHConnection} connection The connection to use
   * @param  {String} platform The operating system to use
   */
  constructor(connection, platform) {
    this.connection = connection;
    this.platform = platform;
  }

  /**
   * Get the commands connection
   * @return {SSHConnection}
   */
  getConnection() {
    return this.connection;
  }

  /**
   * Get the command that should be run, depending on operating system
   * @return {String}
   */
  getCommand() {

    let command;
    let connection = this.getConnection();

    switch(this.platform) {

      case OS_TYPE_WIN:
        command = `putty -l "${connection.userName}" -P ${connection.port} "${connection.hostName}"`;
        break;

      case OS_TYPE_LINUX:
      case OS_TYPE_MAC:
      default:
        command = `ssh -l "${connection.userName}" -p ${connection.port} "${connection.hostName}"`;
        break;
    }

    return command;
  }

  /**
   * Parse the command to string
   * @return {String}
   */
  toString() {
    return this.getCommand();
  }
}

module.exports = SSHCommand;
