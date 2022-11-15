/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { takeLeading } from 'redux-saga/effects';
import { getIndexStatus, getIndexStatusSuccess, getIndexStatusFail } from './actions';
import { fetchEffectFactory } from '../utils/fetch_effect';
import { fetchIndexStatus } from './api';

export function* fetchIndexStatusEffect() {
  yield takeLeading(
    getIndexStatus,
    fetchEffectFactory(fetchIndexStatus, getIndexStatusSuccess, getIndexStatusFail)
  );
}
