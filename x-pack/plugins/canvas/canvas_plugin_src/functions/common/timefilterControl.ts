/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ExpressionFunctionDefinition } from '@kbn/expressions-plugin/common';
import { Render } from '../../../types';
import { getFunctionHelp } from '../../../i18n';

export interface Arguments {
  column: string;
  compact: boolean;
  filterGroup: string;
}
export function timefilterControl(): ExpressionFunctionDefinition<
  'timefilterControl',
  null,
  Arguments,
  Render<Arguments>
> {
  const { help, args: argHelp } = getFunctionHelp().timefilterControl;

  return {
    name: 'timefilterControl',
    aliases: [],
    type: 'render',
    inputTypes: ['null'],
    help,
    args: {
      column: {
        types: ['string'],
        aliases: ['field', 'c'],
        help: argHelp.column,
        default: '@timestamp',
      },
      // TODO: remove this deprecated arg
      compact: {
        types: ['boolean'],
        help: argHelp.compact,
        default: true,
        options: [true, false],
      },
      filterGroup: {
        types: ['string'],
        help: argHelp.filterGroup,
      },
    },
    fn: (input, args) => {
      return {
        type: 'render',
        as: 'time_filter',
        value: args,
      };
    },
  };
}
