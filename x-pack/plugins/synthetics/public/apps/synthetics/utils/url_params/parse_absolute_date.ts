/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import DateMath from '@kbn/datemath';

export const parseAbsoluteDate = (date: string, defaultValue: number, options = {}): number => {
  const momentWrapper = DateMath.parse(date, options);
  if (momentWrapper) {
    return momentWrapper.valueOf();
  }
  return defaultValue;
};
