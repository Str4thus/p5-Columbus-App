import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { ModuleDataService } from '../module-data/module-data.service';
import { createMockModuleDataService, createMockSocket, createMockCommandService } from 'src/columbus/mocking/Mocks.spec';
import { CommandService } from '../command/command.service';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { OpCode, ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { Utils } from 'src/columbus/util/Utils';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';

describe('SocketService', () => {
  let service: SocketService;
  let mockCommandService;
  let mockModuleDataService;
  let mockSocket;

  beforeEach(() => {
    // Mocks
    mockCommandService = createMockCommandService();
    mockModuleDataService = createMockModuleDataService();
    mockSocket = createMockSocket();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataService
        },
        {
          provide: CommandService,
          useValue: mockCommandService
        },
        {
          provide: "MockSocket",
          useValue: mockSocket
        }
      ]
    });

    service = TestBed.get(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Functionality", () => {
    describe("General", () => {
      it("invokes callbacks correctly", () => {
        spyOn(service, "_onOpenCallback");
        spyOn(service, "_onMessageCallback");
        spyOn(service, "_onErrorCallback");
        spyOn(service, "_onCloseCallback");

        service._socket.onopen();
        expect(service._onOpenCallback).toHaveBeenCalled();

        service._socket.onmessage();
        expect(service._onMessageCallback).toHaveBeenCalled();

        service._socket.onerror();
        expect(service._onErrorCallback).toHaveBeenCalled();

        service._socket.onclose();
        expect(service._onCloseCallback).toHaveBeenCalled();
      });

      it("keeps track of connection status", () => {
        expect(service._isConnected).toBeFalsy();

        service._onOpenCallback(new Event("fakeOpen"));
        expect(service._isConnected).toBeTruthy();

        service._onCloseCallback(new Event("fakeClose"));
        expect(service._isConnected).toBeFalsy();
      });
    })

    describe("Callbacks", () => {
      it('"_onErrorCallback" logs the occured error', () => {
        spyOn(console, "log");
        service._onErrorCallback(new Event("fakeError"));

        expect(console.log).toHaveBeenCalled();
      });

      it('"_onOpenCallback" sets "_isConnected" to true', () => {
        expect(service._isConnected).toBeFalsy();

        service._onOpenCallback(new Event("fakeOpen"));

        expect(service._isConnected).toBeTruthy();
      });

      it('"_onCloseCallback" sets "_isConnected" to false', () => {
        service._isConnected = true;
        expect(service._isConnected).toBeTruthy();

        service._onCloseCallback(new Event("fakeClose"));

        expect(service._isConnected).toBeFalsy();
      });

      describe("_onMessageCallback", () => {
        it('correctly invokes "_handleDispatch" if received dispatch command', () => {
          let data = {
            "op": OpCode.DISPATCH,
            "d": {
              "affected_module": "cam",
              "updates": { "hrot": 50 }
            }
          }
          let event = new MessageEvent("fakeMessage", { "data": JSON.stringify(data) });
          spyOn(service, "_handleDispatch");

          service._onMessageCallback(event);

          expect(service._handleDispatch).toHaveBeenCalledWith(ColumbusModuleType.CAMERA, { "hrot": 50 });
        });

        it('correctly invokes "_handleStateUpdate" if received state update command', () => {
          let data = {
            "op": OpCode.STATE_UPDATE,
            "d": {
              "cam": true,
              "vehicle": false,
              "invalidModule": true
            }
          }
          let event = new MessageEvent("fakeMessage", { "data": JSON.stringify(data) });
          spyOn(service, "_handleStateUpdate");

          service._onMessageCallback(event);

          expect(service._handleStateUpdate).toHaveBeenCalledWith({ "cam": true, "vehicle": false, "invalidModule": true });
        });

        it('invokes "_handleHeartbeat" on heartbeat command', () => {
          let data = {
            "op": OpCode.HEARTBEAT
          }
          let event = new MessageEvent("fakeMessage", { "data": JSON.stringify(data) });
          spyOn(service, "_handleHeartbeat");

          service._onMessageCallback(event);

          expect(service._handleHeartbeat).toHaveBeenCalled();
        });

        it('throws error if invalid op code was provided', () => {
          let data = {
            "op": -1
          }
          let event = new MessageEvent("fakeMessage", { "data": JSON.stringify(data) });

          expect(() => service._onMessageCallback(event)).toThrowError("Invalid OpCode!");
        })
      });
    });

    describe("_handleDispatch", () => {
      it('invokes "applyChangesToModuleState of ModuleDataService with the changes', () => {
        let changesToApply = { "test": true };
        service._handleDispatch(ColumbusModuleType.TEST, changesToApply);

        expect(mockModuleDataService.applyChangesToModuleState).toHaveBeenCalledWith(ColumbusModuleType.TEST, changesToApply);
      });
    });

    describe("_handleStateUpdate", () => {
      it('checks if a module is part of "ColumbusModuleType"-Enum', () => {
        spyOn(Utils, "isPartOfEnum");
        let testData = { "cam": true, "invalidModule": false }

        service._handleStateUpdate(testData);

        expect(Utils.isPartOfEnum).toHaveBeenCalledWith(ColumbusModuleType, "cam");
        expect(Utils.isPartOfEnum).toHaveBeenCalledWith(ColumbusModuleType, "invalidModule");
        expect(Utils.isPartOfEnum).toHaveBeenCalledTimes(2);
      });

      it("does not add an already connected module", () => {
        let testData = { "cam": true }
        mockModuleDataService.isModuleConnected.and.callFake((moduleType) => {
          return true;
        });

        service._handleStateUpdate(testData);

        expect(mockModuleDataService.addModule).not.toHaveBeenCalled();
      });

      it("does not remove an already disconnected module", () => {
        let testData = { "cam": false }
        mockModuleDataService.isModuleConnected.and.callFake((moduleType) => {
          return false;
        });

        service._handleStateUpdate(testData);

        expect(mockModuleDataService.removeModule).not.toHaveBeenCalled();
      });

      it("adds a newly connected module", () => {
        let testData = { "cam": true }
        mockModuleDataService.isModuleConnected.and.callFake((moduleType) => {
          return false;
        });

        service._handleStateUpdate(testData);

        expect(mockModuleDataService.addModule).toHaveBeenCalledWith(new ColumbusModule(ColumbusModuleType.CAMERA));
      });

      it("removes a newly disconnected module", () => {
        let testData = { "cam": false }
        mockModuleDataService.isModuleConnected.and.callFake((moduleType) => {
          return true;
        });

        service._handleStateUpdate(testData);

        expect(mockModuleDataService.removeModule).toHaveBeenCalledWith(ColumbusModuleType.CAMERA);
      });
    });

    describe("_queueUpdateCallback", () => {
      it("gets next command in queue upon queue update", () => {
        service._queueUpdateCallback();
        expect(mockCommandService.getNextCommandInQueue).toHaveBeenCalled();
      });

      it('invokes "sendCommand" with the next command in queue', () => {
        spyOn(service, "sendCommand");
        let testCommand = new ColumbusCommand(OpCode.DISPATCH);
        mockCommandService.getNextCommandInQueue.and.callFake(() => {
          return testCommand
        });

        service._queueUpdateCallback();

        expect(service.sendCommand).toHaveBeenCalledWith(testCommand);
      });

      it('does not try to send "null" command, when the queue was empty', () => {
        spyOn(service, "sendCommand");
        mockCommandService.getNextCommandInQueue.and.callFake(() => {
          return null
        });

        service._queueUpdateCallback();

        expect(service.sendCommand).not.toHaveBeenCalled();
      });
    });

    describe("_handleHeartbeat", () => {
      it('invokes "sendCommand" with an HeartbeatACK command', () => {
        spyOn(service, "sendCommand");

        service._handleHeartbeat();
        expect(service.sendCommand).toHaveBeenCalledWith(new ColumbusCommand(OpCode.HEARTBEAT_ACK));
      })
    });

    describe("sendCommand", () => {
      it('does only try to send when the socket is connected', () => {
        let testCommand = new ColumbusCommand(OpCode.DISPATCH);

        service.sendCommand(testCommand);
        expect(service._socket.send).not.toHaveBeenCalled();

        service._socket.onopen();
        service.sendCommand(testCommand);
        expect(service._socket.send).toHaveBeenCalledWith(testCommand.serialize());

        service._socket.onclose();
        service.sendCommand(testCommand);
        expect(service._socket.send).toHaveBeenCalledTimes(1);
      });

      it("serializes the command before sending", () => {
        let testCommand = new ColumbusCommand(OpCode.DISPATCH);
        spyOn(testCommand, "serialize");

        service._socket.onopen();
        service.sendCommand(testCommand);

        expect(testCommand.serialize).toHaveBeenCalled();
        expect(service._socket.send).toHaveBeenCalledWith(testCommand.serialize());
      })
    });
  });
});
