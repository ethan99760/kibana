/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Chart } from '@elastic/charts';
import { EuiLoadingChart } from '@elastic/eui';
import { EuiLoadingChartSize } from '@elastic/eui/src/components/loading/loading_chart';
import React from 'react';

interface Props {
  isInitialLoad: boolean;
  height?: number;
  width?: number;
  iconSize?: EuiLoadingChartSize;
  children: React.ReactNode;
}

const CHART_HEIGHT = 120;

export function ChartContainer({
  isInitialLoad,
  children,
  iconSize = 'l',
  height = CHART_HEIGHT,
}: Props) {
  if (isInitialLoad) {
    return (
      <div
        data-test-subj="loading"
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EuiLoadingChart size={iconSize} />
      </div>
    );
  }
  return <Chart size={{ height }}>{children}</Chart>;
}
