// jscs:disable disallowQuotedKeysInObjects, requireCapitalizedConstructors

import Joypad from '../devices/Joypad';
import Zapper from '../devices/Zapper';
import logger from '../utils/logger';

var devices = {
  'joypad': Joypad,
  'zapper': Zapper,
};

//=========================================================
// Factory for device creation
//=========================================================

export default class DeviceFactory {

  constructor(injector) {
    this.injector = injector;
  }

  createDevice(type) {
    var clazz = devices[type];
    if (clazz) {
      logger.info(`Creating "${type}" device`);
      return this.injector.inject(new clazz);
    }
    throw new Error(`Unsupported device "${type}"`);
  }

}
