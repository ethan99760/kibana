/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ExpressionFunctionDefinition } from '@kbn/expressions-plugin/common';
import { getFunctionHelp } from '../../../i18n';

export function context(): ExpressionFunctionDefinition<'context', unknown, {}, unknown> {
  const { help } = getFunctionHelp().context;

  return {
    name: 'context',
    help,
    args: {},
    fn: (obj) => obj,
  };
}
