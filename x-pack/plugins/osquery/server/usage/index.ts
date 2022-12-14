/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CollectorDependencies } from './types';
import { registerCollector } from './collector';

export type InitUsageCollectors = (deps: CollectorDependencies) => void;

export const initUsageCollectors: InitUsageCollectors = (dependencies) => {
  registerCollector(dependencies);
};
