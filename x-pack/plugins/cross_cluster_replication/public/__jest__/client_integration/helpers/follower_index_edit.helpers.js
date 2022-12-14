/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { registerTestBed } from '@kbn/test-jest-helpers';
import { FollowerIndexEdit } from '../../../app/sections/follower_index_edit';
import { ccrStore } from '../../../app/store';
import { routing } from '../../../app/services/routing';

import { FOLLOWER_INDEX_EDIT_NAME } from './constants';

const testBedConfig = {
  store: ccrStore,
  memoryRouter: {
    onRouter: (router) =>
      (routing.reactRouter = {
        ...router,
        getUrlForApp: () => '',
      }),
    // The follower index id to fetch is read from the router ":id" param
    // so we first set it in our initial entries
    initialEntries: [`/${FOLLOWER_INDEX_EDIT_NAME}`],
    // and then we declarae the :id param on the component route path
    componentRoutePath: '/:id',
  },
};

const initTestBed = registerTestBed(FollowerIndexEdit, testBedConfig);

export const setup = (props) => {
  const testBed = initTestBed(props);

  // User actions
  const clickSaveForm = () => {
    testBed.find('submitButton').simulate('click');
  };

  const toggleAdvancedSettings = () => {
    testBed.form.toggleEuiSwitch('advancedSettingsToggle');
  };

  return {
    ...testBed,
    actions: {
      clickSaveForm,
      toggleAdvancedSettings,
    },
  };
};
