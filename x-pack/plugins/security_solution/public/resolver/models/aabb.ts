/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as vector2 from './vector2';
import type { AABB } from '../types';

/**
 * Return a boolean indicating if 2 vector objects are equal.
 */
export function isEqual(a: AABB, b: AABB): boolean {
  return vector2.isEqual(a.minimum, b.minimum) && vector2.isEqual(a.maximum, b.maximum);
}
