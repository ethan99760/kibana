/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ExpressionFunctionDefinition } from '@kbn/expressions-plugin/common';
import { Datatable } from '../../../types';
import { getFunctionHelp, getFunctionErrors } from '../../../i18n';

interface Arguments {
  column: string;
  row: number;
}

export function getCell(): ExpressionFunctionDefinition<'getCell', Datatable, Arguments, any> {
  const { help, args: argHelp } = getFunctionHelp().getCell;
  const errors = getFunctionErrors().getCell;

  return {
    name: 'getCell',
    help,
    inputTypes: ['datatable'],
    args: {
      column: {
        types: ['string'],
        aliases: ['_', 'c'],
        help: argHelp.column,
      },
      row: {
        types: ['number'],
        aliases: ['r'],
        help: argHelp.row,
        default: 0,
      },
    },
    fn: (input, args) => {
      const row = input.rows[args.row];
      if (!row) {
        throw errors.rowNotFound(args.row);
      }

      const { column = input.columns[0].name } = args;
      const value = row[column];

      if (typeof value === 'undefined') {
        throw errors.columnNotFound(column);
      }

      return value;
    },
  };
}
