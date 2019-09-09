import { AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { HttpErrors } from "@loopback/rest";
import { getLogger } from 'log4js';

import { AppIdUser } from "./AppIdUser";

const logger = getLogger('AppIdComponent');

export class AppIdAuthorization {

  constructor(
    @inject(AuthenticationBindings.CURRENT_USER) private user: AppIdUser,
  ) {
    logger.debug(`Authorization configured for user ${JSON.stringify(user)}`);
  }

  authorizeByEmail(value: string | string[] | undefined, model?: any) {
    if (value === undefined) {
      this.unauthorized(model, undefined);
    } else {
      if (typeof value === 'string') {
        value = [value];
      }

      for (let i = 0; i < value.length; i++) {
        if (this.user.email.toLocaleLowerCase() === value[i].toLocaleLowerCase()) {
          return;
        }
      }

      this.unauthorized(model);
    }
  }

  authorizeById(value: string | string[] | undefined, model?: any) {
    if (value === undefined) {
      this.unauthorized(model, undefined);
    } else {
      if (typeof value === 'string') {
        value = [value];
      }

      const { identities } = this.user;

      if (!identities) {
        return 'anonymous';
      }

      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.user.identities.length; j++) {
          if (value[i] === this.user.identities[j].id) {
            return;
          }
        }
      }

      this.unauthorized(model);
    }
  }

  unauthorized(model?: any, userId = this.user.email) {
    const msg = model ? `Unauthorized access on ${model.id} by user ${userId}` :
      `Unauthorized access by user ${userId}`;

    logger.warn(msg);
    throw new HttpErrors.Unauthorized(msg);
  }

  getEmail() {
    return this.user.email;
  }

  getIdentity(provider = 'cloud_directory'): string {
    const { identities } = this.user;

    // this user is an anonymous user
    if (!identities || identities.length === 0) {
      return 'anonymous';
    }

    const identity = this.user.identities.find(identity => identity.provider === provider);

    if (!identity) {
      console.error(`Could not find identity for user ${this.user.email} with provider ${provider}`);
      return 'anonymous';
    } else {
      return identity.id;
    }
  }
}
