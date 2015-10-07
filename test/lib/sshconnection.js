'use strict';
const expect = require('chai').expect;
const SSHConnection = require('../../lib/sshconnection');

describe('SSHConnection', () => {

  let connection;

  beforeEach(() => {
    connection = new SSHConnection('connection', 'user', 'host', 22);
  });

  describe('When creating a new connection', () => {

    it('should include user, host and port', () => {
      expect(connection.connectionName).to.equal('connection');
      expect(connection.userName).to.equal('user');
      expect(connection.hostName).to.equal('host');
      expect(connection.port).to.equal(22);
    });

    it('should set the default port to 22 if the setting is omitted', () => {

      let dfltConnection = new SSHConnection('user', 'host');
      expect(dfltConnection.port).to.equal(22);
    });
  });

  describe('When setting the connectionName', () => {

    it('should throw an error if an invalid connectionName was provided', () => {

      expect(() => {
        connection.setConnectionName();
      }).to.throw();

      expect(() => {
        connection.setConnectionName(false);
      }).to.throw();

      expect(() => {
        connection.setConnectionName('');
      }).to.throw();
    });

    it('should set the new connectionName', () => {
      connection.setConnectionName('testConnection');
      expect(connection.connectionName).to.equal('testConnection');
    });

    it('should use a fluent interface', () => {
      expect(connection.setConnectionName('testConnection')).to.a.instanceof(SSHConnection);
    });
  });

  describe('When setting the userName', () => {

    it('should throw an error if an invalid userName was provided', () => {

      expect(() => {
        connection.setUserName();
      }).to.throw();

      expect(() => {
        connection.setUserName(false);
      }).to.throw();

      expect(() => {
        connection.setUserName('');
      }).to.throw();
    });

    it('should set the new userName', () => {
      connection.setUserName('testUser');
      expect(connection.userName).to.equal('testUser');
    });

    it('should use a fluent interface', () => {
      expect(connection.setUserName('testUser')).to.a.instanceof(SSHConnection);
    });
  });

  describe('When setting the hostName', () => {

    it('should throw an error if an invalid hostName was provided', () => {

      expect(() => {
        connection.setHostName();
      }).to.throw();

      expect(() => {
        connection.setHostName(false);
      }).to.throw();

      expect(() => {
        connection.setHostName('');
      }).to.throw();
    });

    it('should set the new hostName', () => {
      connection.setHostName('testHost');
      expect(connection.hostName).to.equal('testHost');
    });

    it('should use a fluent interface', () => {
      expect(connection.setHostName('testHost')).to.a.instanceof(SSHConnection);
    });
  });

  describe('When setting the port', () => {

    it('should throw an error if an invalid value was provided', () => {

      expect(() => {
        connection.setPort();
      }).to.throw();

      expect(() => {
        connection.setPort(false);
      }).to.throw();

      expect(() => {
        connection.setPort('something');
      }).to.throw();
    });

    it('should set the new port', () => {
      connection.setPort(100);
      expect(connection.port).to.equal(100);
    });

    it('should use a fluent interface', () => {
      expect(connection.setPort(22)).to.a.instanceof(SSHConnection);
    });
  });

  describe('When outputting the final command', () => {

    it('should return the commands string', () => {

      expect(connection.getCommand('linux')).to.equal('ssh -l "user" -p 22 host');
    });
  });

  describe('When serializing to object', () => {

    it('should return the object', () => {

      expect(connection.toObject()).to.deep.equal({
        connectionName: 'connection',
        userName: 'user',
        hostName: 'host',
        port: 22
      });
    });
  });

  describe('When creating a new connection from an object', () => {

    it('should throw an error if the provided options are not correct', () => {

      expect(() => {
        SSHConnection.fromObject({
          connectionName: 'connection',
          userName: 'user'
        });
      }).to.throw();
    });

    it('should create the new SSHConnection if all parameters are given', () => {

      let settings = {
        connectionName: 'testConnection',
        userName: 'testUser',
        hostName: 'testHost',
        port: 22
      };

      expect(SSHConnection.fromObject(settings).toObject()).to.deep.equal(settings);
    });
  });
});
