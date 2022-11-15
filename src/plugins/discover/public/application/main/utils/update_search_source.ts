/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ISearchSource } from '@kbn/data-plugin/public';
import { DataViewType, DataView } from '@kbn/data-views-plugin/public';
import type { SortOrder } from '@kbn/saved-search-plugin/public';
import { SORT_DEFAULT_ORDER_SETTING } from '../../../../common';
import { DiscoverServices } from '../../../build_services';
import { getSortForSearchSource } from '../../../utils/sorting';

/**
 * Helper function to update the given searchSource before fetching/sharing/persisting
 */
export function updateSearchSource(
  searchSource: ISearchSource,
  persist = true,
  {
    dataView,
    services,
    sort,
    useNewFieldsApi,
  }: {
    dataView: DataView;
    services: DiscoverServices;
    sort: SortOrder[];
    useNewFieldsApi: boolean;
  }
) {
  const { uiSettings, data } = services;
  const parentSearchSource = persist ? searchSource : searchSource.getParent()!;

  parentSearchSource
    .setField('index', dataView)
    .setField('query', data.query.queryString.getQuery() || null)
    .setField('filter', data.query.filterManager.getFilters());

  if (!persist) {
    const usedSort = getSortForSearchSource(
      sort,
      dataView,
      uiSettings.get(SORT_DEFAULT_ORDER_SETTING)
    );
    searchSource.setField('trackTotalHits', true).setField('sort', usedSort);

    if (dataView.type !== DataViewType.ROLLUP) {
      // Set the date range filter fields from timeFilter using the absolute format. Search sessions requires that it be converted from a relative range
      searchSource.setField('filter', data.query.timefilter.timefilter.createFilter(dataView));
    }

    if (useNewFieldsApi) {
      searchSource.removeField('fieldsFromSource');
      const fields: Record<string, string> = { field: '*' };

      fields.include_unmapped = 'true';

      searchSource.setField('fields', [fields]);
    } else {
      searchSource.removeField('fields');
    }
  }
}