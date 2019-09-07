import { AuthenticationBindings, AuthenticationComponent } from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { CoreTags } from '@loopback/core';
import { RestApplication } from '@loopback/rest';

import { getLogger } from 'log4js';
const logger = getLogger('AppIdComponent');

const AppId = require('ibmcloud-appid');
const MockStrategy = require('passport-mock-strategy');

/**
 * Adds IBM App ID authentication to Loopback 4.
 */
export class AppIdAuthentication {

  /**
   * Loads Loopback authentication on your app.
   * @param app Loopback application (normally created in `main` function of `index.ts`)
   */
  constructor(private app: RestApplication) {
    // loads authentication
    app.component(AuthenticationComponent);
    
    const options = app.options['app-id'];
    
    const { MOCK_STRATEGY, MOCK_EMAIL, MOCK_NAME, MOCK_IDP, MOCK_ID } = process.env;

    // if App ID has been configured, register its strategy; else use a mock strategy
    if (options && !MOCK_STRATEGY) {
      logger.info(`App ID strategy configured`);
      this.registerAppIdStrategy(options);
    } else {
      logger.warn(`Mock strategy configured`);
      this.registerMockStrategy(MOCK_EMAIL, MOCK_NAME, MOCK_ID, MOCK_IDP);
    }
  }

  /**
   * Registers the App ID authentication strategy with your application.
   * @param options App ID credentials object obtained from IBM Cloud
   */
  registerAppIdStrategy(options: any) {
    this.registerStrategy(new AppId.APIStrategy(options));
  }

  /**
   * Registers a mock authentication strategy used during testing.
   * @param email the email address of the user
   * @param name the display name of the user
   * @param idpId the identity provider  
   * @param idpName the identity provider name (defaults to cloud_directory)
   */
  registerMockStrategy(email: string = 'user@example.com', name = 'Mock User', idpId = '0', idpName = 'cloud_directory') {
    logger.warn(`Registering mock strategy with ${email} ${name} ${idpId} ${idpName}`);
    
    this.registerStrategy(new MockStrategy({
      name: 'appid-api-strategy',
      user: {
        email,
        name,
        identities: [
          {
            provider: idpName,
            id: idpId
          }
        ]
      }
    }));
  }

  /**
   * Creates and binds a StrategyAdapter to Loopback.
   * @param strategy the Passport strategy
   * @param name the strategy's name used with `@authenticate` decorator (defaults to appid-api-strategy)
   */
  registerStrategy(strategy: any, name = 'appid-api-strategy') {
    this.app
      .bind('authentication.strategies.appIdAuthStrategy')
      .to(new StrategyAdapter(strategy, name))
      .tag({
        [CoreTags.EXTENSION_FOR]:
          AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
      });
  }
}