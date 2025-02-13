/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  FirebaseAppCheckInternal,
  AppCheckInternalComponentName
} from '@firebase/app-check-interop-types';
import { FirebaseApp } from '@firebase/app-types';
import {
  FirebaseAuthInternal,
  FirebaseAuthInternalName
} from '@firebase/auth-interop-types';
import {
  Component,
  ComponentContainer,
  ComponentType,
  Provider
} from '@firebase/component';

import { repoManagerDatabaseFromApp } from '../api/Database';
import { Database } from '../api.standalone';
import { setSDKVersion } from '../core/version';

/**
 * Used by console to create a database based on the app,
 * passed database URL and a custom auth implementation.
 * @internal
 * @param app - A valid FirebaseApp-like object
 * @param url - A valid Firebase databaseURL
 * @param version - custom version e.g. firebase-admin version
 * @param customAppCheckImpl - custom app check implementation
 * @param customAuthImpl - custom auth implementation
 */
export function _initStandalone({
  app,
  url,
  version,
  customAuthImpl,
  customAppCheckImpl,
  nodeAdmin = false
}: {
  app: FirebaseApp;
  url: string;
  version: string;
  customAuthImpl: FirebaseAuthInternal;
  customAppCheckImpl?: FirebaseAppCheckInternal;
  nodeAdmin?: boolean;
}): Database {
  setSDKVersion(version);

  /**
   * ComponentContainer('database-standalone') is just a placeholder that doesn't perform
   * any actual function.
   */
  const componentContainer = new ComponentContainer('database-standalone');
  const authProvider = new Provider<FirebaseAuthInternalName>(
    'auth-internal',
    componentContainer
  );
  let appCheckProvider: Provider<AppCheckInternalComponentName>;
  if (customAppCheckImpl) {
    appCheckProvider = new Provider<AppCheckInternalComponentName>(
      'app-check-internal',
      componentContainer
    );
    appCheckProvider.setComponent(
      new Component(
        'app-check-internal',
        () => customAppCheckImpl,
        ComponentType.PRIVATE
      )
    );
  }
  authProvider.setComponent(
    new Component('auth-internal', () => customAuthImpl, ComponentType.PRIVATE)
  );

  return repoManagerDatabaseFromApp(
    app,
    authProvider,
    appCheckProvider,
    url,
    nodeAdmin
  );
}
