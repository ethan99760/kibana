/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export function MonitoringKibanaOverviewProvider({ getService }) {
  const testSubjects = getService('testSubjects');
  const retry = getService('retry');
  const find = getService('find');

  const SUBJ_OVERVIEW_PAGE = 'kibanaOverviewPage';
  const SUBJ_KBN_INSTANCES = 'kibanaInstancesPage';

  return new (class KibanaOverview {
    async isOnOverview() {
      const pageId = await retry.try(() => testSubjects.find(SUBJ_OVERVIEW_PAGE));
      await find.byCssSelector('[data-is-loaded="true"]');
      return pageId !== null;
    }

    async clickInstanceTab() {
      return testSubjects.click(SUBJ_KBN_INSTANCES);
    }
  })();
}
