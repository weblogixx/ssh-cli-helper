'use strict';
const expect = require('chai').expect;
const SSHConnection = require('../../lib/sshconnection');
const SSHCommand = require('../../lib/sshcommand');

describe('SSHCommand', () => {

  let connection;

  beforeEach(() => {
    connection = new SSHConnection('connection', 'user', 'host');
  });

  describe('When creating a new command', () => {

    it('should set the connection and operating system', () => {
      let command = new SSHCommand(connection, 'win');

      expect(command.connection).to.be.a.instanceof(SSHConnection);
      expect(command.platform).to.equal('win');
    });
  });

  describe('When using getCommand', () => {

    it('should produce the correct command for unix like systems', () => {

      let commandLinux = new SSHCommand(connection, 'linux');
      let commandMac = new SSHCommand(connection, 'linux');

      expect(commandLinux.getCommand()).to.equal('ssh -l "user" -p 22 "host"');
      expect(commandMac.getCommand()).to.equal('ssh -l "user" -p 22 "host"');
    });

    it('should produce the correct command for windows, using putty', () => {

      let commandWin = new SSHCommand(connection, 'win');
      expect(commandWin.getCommand()).to.equal('putty -l "user" -P 22 "host"');
    });
  });

});
