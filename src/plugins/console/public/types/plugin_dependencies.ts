/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { HomePublicPluginSetup } from '@kbn/home-plugin/public';
import { DevToolsSetup } from '@kbn/dev-tools-plugin/public';
import { UsageCollectionSetup } from '@kbn/usage-collection-plugin/public';
import { SharePluginSetup, LocatorPublic } from '@kbn/share-plugin/public';

import { ConsoleUILocatorParams } from './locator';

export interface AppSetupUIPluginDependencies {
  home?: HomePublicPluginSetup;
  devTools: DevToolsSetup;
  share: SharePluginSetup;
  usageCollection?: UsageCollectionSetup;
}

export interface ConsolePluginSetup {
  locator?: LocatorPublic<ConsoleUILocatorParams>;
}
