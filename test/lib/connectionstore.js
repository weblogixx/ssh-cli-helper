'use strict';
const fs = require('fs');
const expect = require('chai').expect;
const sinon = require('sinon');

const ConnectionStore = require('../../lib/connectionstore');
const SSHConnection = require('../../lib/sshconnection');

describe('ConnectionStore', () => {

  let connectionStubs = [
    SSHConnection.fromObject({
      connectionName: 'Connection 1',
      userName: 'my username',
      hostName: 'localhost'
    }),
    SSHConnection.fromObject({
      connectionName: 'Connection 2',
      userName: 'my username',
      hostName: 'localhost'
    }),
    SSHConnection.fromObject({
      connectionName: 'Connection 3',
      userName: 'my username',
      hostName: 'localhost'
    })
  ];

  describe('When creating a new connection store', () => {

    it('should have an empty connection store if no arguments are given', () => {

      let store = new ConnectionStore();
      expect(store.storage).to.be.empty;
    });

    it('should load connections from the given file if the argument is specified', () => {

      let stub = sinon.stub(ConnectionStore, 'getDataFromStorage');
      stub.returns(connectionStubs);

      let store = new ConnectionStore('testfile');
      expect(store.storage).to.deep.equal(connectionStubs);

      stub.restore();
    });
  });

  describe('When adding new connections', () => {

    it('should only allow valid SSHCOnnection objects', () => {

      let store = new ConnectionStore();
      let connection = new SSHConnection('connection 1', 'user', 'host');

      expect(store.addConnection('invalid')).to.be.false;
      expect(store.addConnection(connection)).to.be.true;
    });

    it('should add connections to the store', () => {

      let store = new ConnectionStore();
      let connection = new SSHConnection('connection 1', 'user', 'host');

      expect(store.addConnection(connection)).to.be.true;
      expect(store.storage).to.have.length(1);
      expect(store.storage[0]).to.deep.equal(connection);
    });
  });

  describe('When removing connections', () => {

    it('should only allow SSHConnections or numeric indices', () => {

      let store = new ConnectionStore();

      expect(() => {
        store.removeConnection('test');
      }).to.throw();

      expect(() => {
        store.removeConnection({ connection: 'test' });
      }).to.throw();

      expect(() => {
        store.removeConnection(0);
        store.removeConnection(new SSHConnection('connection 1', 'user', 'host'));
      }).not.to.throw();
    });

    it('should be able to remove items by index', () => {

      let stub = sinon.stub(ConnectionStore, 'getDataFromStorage');
      stub.returns(connectionStubs);

      let store = new ConnectionStore('testfile');
      expect(store.removeConnection(1)).to.be.true;
      expect(store.storage).to.have.length(2);

      stub.restore();
    });

    it('should be able to remove items with the given SSHConnection', () => {

      let connection = new SSHConnection('name', 'user', 'pass');
      let store = new ConnectionStore();
      store.addConnection(connection);

      expect(store.removeConnection(connection)).to.be.true;
      expect(store.storage).to.have.length(0);
    });
  });

  describe('When saving storage information to a file', () => {

    it('should return true if the file was saved successfully', () => {

      let testFile = __dirname + '/../mocks/test.json';
      fs.unlinkSync(testFile);

      let store = new ConnectionStore();
      store.addConnection(connectionStubs[0]);
      store.addConnection(connectionStubs[1]);

      expect(store.saveDataToStorage(testFile)).to.be.true;

      let storeData = ConnectionStore.getDataFromStorage(testFile);
      expect(storeData[0]).to.deep.equal(connectionStubs[0]);

      fs.unlinkSync(testFile);
    });
  });

  describe('When loading storage information from a file', () => {

    it('should return false if the file could not be found', () => {
      expect(ConnectionStore.getDataFromStorage('nonexistent')).to.be.false;
    });

    it('should return all connections as array if there are any', () => {

      let connections = ConnectionStore.getDataFromStorage(__dirname + '/../mocks/connections.json');
      expect(connections).to.be.an.array;
      expect(connections).to.have.length(3);
      expect(connections[0].toObject()).to.deep.equal({
        connectionName: 'Xerxes',
        userName: 'root',
        hostName: 'xerxes.local',
        port: 22
      });
    });
  });

});
