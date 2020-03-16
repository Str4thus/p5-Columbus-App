import { TestBed } from '@angular/core/testing';

import { CommandService } from './command.service';
import { ColumbusEventType, OpCode, ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';

describe('CommandService', () => {
  let testModule: ColumbusModule
  let service: CommandService
  
  beforeEach(() => {
    testModule = new ColumbusModule(ColumbusModuleType.TEST);

    TestBed.configureTestingModule({})

    service = TestBed.get(CommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Command Generation", () => {
    it('generates the command on "addCommandToQueue" automatically', () => {
      spyOn(service, "_generateCommand");
      let updatedModule = new ColumbusModule(ColumbusModuleType.TEST, { "updated": true });
      service.addCommandToQueue(ColumbusEventType.TEST, updatedModule);
      expect(service._generateCommand).toHaveBeenCalledWith(ColumbusEventType.TEST, updatedModule);
    });

    it('generates the correct command', () => {
      let commandData = { t: ColumbusEventType.TEST, p: { "updated": true } }
      let expectedCommand: ColumbusCommand = new ColumbusCommand(OpCode.DISPATCH, commandData);
      let updatedModule = new ColumbusModule(ColumbusModuleType.TEST, { "updated": true });

      let actualCommand = service._generateCommand(ColumbusEventType.TEST, updatedModule);

      expect(expectedCommand).toEqual(actualCommand);
    });
  });

  describe("Command Management", () => {
    it("adds command to queue correctly", () => {
      expect(service._commandQueue.length).toBe(0);
      service.addCommandToQueue(ColumbusEventType.TEST, testModule);
      expect(service._commandQueue.length).toBe(1);
      service.addCommandToQueue(ColumbusEventType.TEST, testModule);
      expect(service._commandQueue.length).toBe(2);
    });

    it("gets the oldest object from queue", () => {
      let testModuleA = new ColumbusModule(ColumbusModuleType.TEST, { "command": true });
      let testModuleB = new ColumbusModule(ColumbusModuleType.TEST, { "command": false });

      service.addCommandToQueue(ColumbusEventType.TEST, testModuleB);
      service.addCommandToQueue(ColumbusEventType.TEST, testModuleA);
      service.addCommandToQueue(ColumbusEventType.TEST, testModuleA);

      expect(service.getNextCommandInQueue()).toEqual(service._generateCommand(ColumbusEventType.TEST, testModuleB));
    });

    it("returns null if tried to get a command with empty queue", () => {
      service.addCommandToQueue(ColumbusEventType.TEST, testModule);
      service.getNextCommandInQueue()

      expect(service._commandQueue.length).toBe(0);
    });

    it("removes the command after getting it", () => {
      expect(service._commandQueue.length).toBe(0);
      expect(service.getNextCommandInQueue()).toEqual(null);
    });
  });

  describe("Subscription", () => {
    it("can subscribe to queue", () => {
      expect(service._observers.length).toBe(0);
      service.subscribeToQueue((command) => {});
      expect(service._observers.length).toBe(1);
    });

    it("notifies observers when a new command gets added to the queue", () => {
      let callbackSpy = jasmine.createSpy("callbackSpy");
      service.subscribeToQueue((command) => {
        callbackSpy(command);
      });

      service.addCommandToQueue(ColumbusEventType.TEST, testModule);
      
      let expectedCommand = service._generateCommand(ColumbusEventType.TEST, testModule);
      expect(callbackSpy).toHaveBeenCalledWith(expectedCommand);
    });
  });
});
