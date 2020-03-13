import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { MockSocket, MockDataService } from 'src/app/mocks/Mocks';
import { SocketConfiguration } from 'src/app/util/SocketConfiguration';
import { OpCode } from 'src/app/util/Enums';
import { DataService } from '../data/data.service';

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: MockSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: DataService, useFactory: () => MockDataService.instance()}
      ]
    });
    service = TestBed.get(SocketService);
    mockSocket = new MockSocket(SocketConfiguration.defaultURL());

    service.initSocket(mockSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Socket Connection Establishment / Loss', () => {
    it('should connect to socket', () => {
      mockSocket.mockOpen();

      expect(service.isConnected.value).toBeTruthy();
    });

    it('should not be connected if socket is closed', () => {
      expect(service.isConnected.value).toBeFalsy();
    });

    it('can disconnect cleanly', () => {
      // Connection setup
      mockSocket.mockOpen();
      expect(service.isConnected.value).toBeTruthy();

      // Clean Disconnect
      mockSocket.mockCleanConnectionClose();
      expect(service.isConnected.value).toBeFalsy();
    });

    it('can handle connection interruption', () => {
      // Connection Setup
      mockSocket.mockOpen();
      expect(service.isConnected.value).toBeTruthy();

      // Connection Interruption
      mockSocket.mockConnectionInterrupted();
      expect(service.isConnected.value).toBeFalsy();
    });
  })

  describe("Communication", () => {
    it('should receive "Hello" in the beginning', () => {
      mockSocket.mockHello();
      expect(service.dataService.addConnectedModule).toHaveBeenCalledTimes(2);
    });

    it('should respond to heartbeat', () => {
      mockSocket.mockOpen();
      mockSocket.mockHeartbeat();

      let sentMessage = JSON.parse(mockSocket.sentMessage);
      expect(sentMessage["op"]).toBe(OpCode.HEARTBEAT_ACK);
    });
  })  
});
