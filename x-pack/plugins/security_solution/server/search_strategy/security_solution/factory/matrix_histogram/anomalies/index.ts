/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { MatrixHistogramTypeToAggName } from '../../../../../../common/search_strategy';
import { buildAnomaliesHistogramQuery } from './query.anomalies_histogram.dsl';

export const anomaliesMatrixHistogramConfig = {
  buildDsl: buildAnomaliesHistogramQuery,
  aggName: MatrixHistogramTypeToAggName.anomalies,
  parseKey: 'anomalies.buckets',
};
