/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useState, useCallback } from 'react';
import { DataViewBase } from '@kbn/es-query';
import { MetricsSourceConfigurationProperties } from '../../../../../common/metrics_sources';
import {
  MetricsExplorerMetric,
  MetricsExplorerAggregation,
} from '../../../../../common/http_api/metrics_explorer';
import { useMetricsExplorerData } from './use_metrics_explorer_data';
import {
  useMetricsExplorerOptionsContainerContext,
  MetricsExplorerChartOptions,
  MetricsExplorerTimeOptions,
  MetricsExplorerOptions,
} from './use_metrics_explorer_options';

export interface MetricExplorerViewState {
  chartOptions: MetricsExplorerChartOptions;
  currentTimerange: MetricsExplorerTimeOptions;
  options: MetricsExplorerOptions;
  id?: string;
}

export const useMetricsExplorerState = (
  source: MetricsSourceConfigurationProperties,
  derivedIndexPattern: DataViewBase,
  shouldLoadImmediately = true
) => {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [afterKey, setAfterKey] = useState<string | null | Record<string, string | null>>(null);
  const {
    defaultViewState,
    options,
    currentTimerange,
    chartOptions,
    setChartOptions,
    setTimeRange,
    setOptions,
  } = useMetricsExplorerOptionsContainerContext();

  const { loading, error, data, loadData } = useMetricsExplorerData(
    options,
    source,
    derivedIndexPattern,
    currentTimerange,
    afterKey,
    refreshSignal,
    shouldLoadImmediately
  );

  const handleRefresh = useCallback(() => {
    setAfterKey(null);
    setRefreshSignal(refreshSignal + 1);
  }, [refreshSignal]);

  const handleTimeChange = useCallback(
    (start: string, end: string) => {
      setAfterKey(null);
      setTimeRange({ ...currentTimerange, from: start, to: end });
    },
    [currentTimerange, setTimeRange]
  );

  const handleGroupByChange = useCallback(
    (groupBy: string | null | string[]) => {
      setAfterKey(null);
      setOptions({
        ...options,
        groupBy: groupBy || void 0,
      });
    },
    [options, setOptions]
  );

  const handleFilterQuerySubmit = useCallback(
    (query: string) => {
      setAfterKey(null);
      setOptions({
        ...options,
        filterQuery: query,
      });
    },
    [options, setOptions]
  );

  const handleMetricsChange = useCallback(
    (metrics: MetricsExplorerMetric[]) => {
      setAfterKey(null);
      setOptions({
        ...options,
        metrics,
      });
    },
    [options, setOptions]
  );

  const handleAggregationChange = useCallback(
    (aggregation: MetricsExplorerAggregation) => {
      setAfterKey(null);
      const metrics =
        aggregation === 'count'
          ? [{ aggregation }]
          : options.metrics
              .filter((metric) => metric.aggregation !== 'count')
              .map((metric) => ({
                ...metric,
                aggregation,
              }));
      setOptions({ ...options, aggregation, metrics });
    },
    [options, setOptions]
  );

  const onViewStateChange = useCallback(
    (vs: MetricExplorerViewState) => {
      if (vs.chartOptions) {
        setChartOptions(vs.chartOptions);
      }
      if (vs.currentTimerange) {
        // if this is the "Default View" view, don't update the time range to the view's time range,
        // this way it will use the global Kibana time or the default time already set
        if (vs.id !== '0') {
          setTimeRange(vs.currentTimerange);
        }
      }
      if (vs.options) {
        setOptions(vs.options);
      }
    },
    [setChartOptions, setOptions, setTimeRange]
  );

  return {
    loading,
    error,
    data,
    currentTimerange,
    options,
    chartOptions,
    setChartOptions,
    handleAggregationChange,
    handleMetricsChange,
    handleFilterQuerySubmit,
    handleGroupByChange,
    handleTimeChange,
    handleRefresh,
    handleLoadMore: setAfterKey,
    defaultViewState,
    onViewStateChange,
    loadData,
    refreshSignal,
    afterKey,
  };
};
