/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const ACTION_STATES: { [key: string]: string } = {
  // Action is not being executed because conditions haven't been met
  OK: i18n.translate('xpack.watcher.constants.actionStates.okStateText', {
    defaultMessage: 'OK',
  }),

  // Action has been acknowledged by user
  ACKNOWLEDGED: i18n.translate('xpack.watcher.constants.actionStates.acknowledgedStateText', {
    defaultMessage: 'Acknowledged',
  }),

  // Action has been throttled (time-based) by the system
  THROTTLED: i18n.translate('xpack.watcher.constants.actionStates.throttledStateText', {
    defaultMessage: 'Throttled',
  }),

  // Action has failed
  ERROR: i18n.translate('xpack.watcher.constants.actionStates.errorStateText', {
    defaultMessage: 'Error',
  }),

  // Action has a configuration error
  CONFIG_ERROR: i18n.translate('xpack.watcher.constants.actionStates.configErrorStateText', {
    defaultMessage: 'Config error',
  }),

  // Action status is unknown; we should never end up in this state
  UNKNOWN: i18n.translate('xpack.watcher.constants.actionStates.unknownStateText', {
    defaultMessage: 'Unknown',
  }),
};
