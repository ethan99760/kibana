/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO use engine_logic.mock instead of setMockValues({ engineName: 'some-engine' }), currently that breaks the test
import { setMockValues } from '../../../../../../__mocks__/kea_logic';
// import '../../../../../__mocks__/engine_logic.mock';

import React from 'react';

import { shallow } from 'enzyme';

import { EuiButtonEmpty } from '@elastic/eui';

import { nextTick } from '@kbn/test-jest-helpers';

import { EntSearchLogStream } from '../../../../../../shared/log_stream';
import { DataPanel } from '../../../../data_panel';

import { AutomatedCurationsHistoryPanel } from './automated_curations_history_panel';

describe('AutomatedCurationsHistoryPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockValues({ engineName: 'some-engine' });
  });

  it('renders', () => {
    const wrapper = shallow(<AutomatedCurationsHistoryPanel />);

    expect(wrapper.is(DataPanel)).toBe(true);
    expect(wrapper.find(EntSearchLogStream).prop('query')).toEqual(
      'event.kind: event and event.dataset: search-relevance-suggestions and appsearch.adaptive_relevance.engine: some-engine and event.action: curation_suggestion and appsearch.adaptive_relevance.suggestion.new_status: automated'
    );
  });

  it('sets new endTimestamp when refresh is pressed', async () => {
    const wrapper = shallow(<AutomatedCurationsHistoryPanel />);
    const initialTimestamp = wrapper.find(EntSearchLogStream).prop('endTimestamp');
    await nextTick();

    // Find the refresh button and click
    shallow(wrapper.find(DataPanel).prop('title')).find(EuiButtonEmpty).simulate('click');

    wrapper.update();

    expect(wrapper.find(EntSearchLogStream).prop('endTimestamp')).not.toEqual(initialTimestamp);
  });
});
