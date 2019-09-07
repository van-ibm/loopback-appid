import { Component, CoreBindings, inject } from '@loopback/core';
import { RestApplication } from '@loopback/rest';
import { getLogger } from 'log4js';

import { AppIdAuthentication } from './AppIdAuthentication';
import { AppIdAuthorization } from './AppIdAuthorization';

require('dotenv').config();

const logger = getLogger('AppIdComponent');
logger.level = process.env.LOG_LEVEL || 'info';

/**
 * Adds IBM App ID authentication and authorization for Loopback 4.
 */
export class AppIdComponent implements Component {

  classes = {
    'ibm-appid': AppIdAuthorization,
  };

  /**
   * Loads Loopback authentication on your app.
   * @param app Loopback application (normally created in `main` function of `index.ts`)
   */
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication) {
    const authentication = new AppIdAuthentication(app);
  }
}