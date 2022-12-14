/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../ftr_provider_context';

export default function spaceSelectorFunctionalTests({
  getService,
  getPageObjects,
}: FtrProviderContext) {
  const kbnServer = getService('kibanaServer');
  const spaces = getService('spaces');
  const testSubjects = getService('testSubjects');
  const PageObjects = getPageObjects(['security', 'settings', 'copySavedObjectsToSpace']);
  const log = getService('log');

  describe('Copy Saved Objects to Space', function () {
    before(async () => {
      log.debug('Loading test data for the following spaces: default, sales');
      await Promise.all([
        kbnServer.importExport.load(
          'x-pack/test/functional/fixtures/kbn_archiver/spaces/copy_saved_objects_default_space.json'
        ),
        kbnServer.importExport.load(
          'x-pack/test/functional/fixtures/kbn_archiver/spaces/copy_saved_objects_sales_space.json',
          { space: 'sales' }
        ),
      ]);

      await spaces.create({
        id: 'marketing',
        name: 'Marketing',
        disabledFeatures: [],
      });

      await spaces.create({
        id: 'sales',
        name: 'Sales',
        disabledFeatures: [],
      });

      await PageObjects.security.forceLogout();
      await PageObjects.security.login(undefined, undefined, {
        expectSpaceSelector: true,
      });

      await PageObjects.settings.navigateTo();
      await PageObjects.settings.clickKibanaSavedObjects();
    });

    after(async () => {
      log.debug('Removing data from the following spaces: default, sales');
      await Promise.all(
        ['default', 'sales'].map((spaceId) =>
          kbnServer.savedObjects.cleanStandardList({ space: spaceId })
        )
      );

      await spaces.delete('sales');
      await spaces.delete('marketing');
    });

    it('allows a dashboard to be copied to the marketing space, with all references', async () => {
      const destinationSpaceId = 'marketing';

      await PageObjects.copySavedObjectsToSpace.openCopyToSpaceFlyoutForObject('A Dashboard');

      await PageObjects.copySavedObjectsToSpace.setupForm({
        createNewCopies: false,
        overwrite: true,
        destinationSpaceId,
      });

      await PageObjects.copySavedObjectsToSpace.startCopy();

      // Wait for successful copy
      await testSubjects.waitForDeleted(`cts-summary-indicator-loading-${destinationSpaceId}`);
      await testSubjects.existOrFail(`cts-summary-indicator-success-${destinationSpaceId}`);

      const summaryCounts = await PageObjects.copySavedObjectsToSpace.getSummaryCounts();

      expect(summaryCounts).to.eql({
        success: 3,
        pending: 0,
        skipped: 0,
        errors: 0,
      });

      await PageObjects.copySavedObjectsToSpace.finishCopy();
    });

    it('allows conflicts to be resolved', async () => {
      const destinationSpaceId = 'sales';

      await PageObjects.copySavedObjectsToSpace.openCopyToSpaceFlyoutForObject('A Dashboard');

      await PageObjects.copySavedObjectsToSpace.setupForm({
        createNewCopies: false,
        overwrite: false,
        destinationSpaceId,
      });

      await PageObjects.copySavedObjectsToSpace.startCopy();

      // Wait for successful copy with conflict warning
      await testSubjects.waitForDeleted(`cts-summary-indicator-loading-${destinationSpaceId}`);
      await testSubjects.existOrFail(`cts-summary-indicator-conflicts-${destinationSpaceId}`);

      const summaryCounts = await PageObjects.copySavedObjectsToSpace.getSummaryCounts();

      expect(summaryCounts).to.eql({
        success: 0,
        pending: 2,
        skipped: 1,
        errors: 0,
      });

      // Mark conflict for overwrite
      await testSubjects.click(`cts-space-result-${destinationSpaceId}`);
      await testSubjects.click(`cts-overwrite-conflict-index-pattern:logstash-*`);

      // Verify summary changed
      const updatedSummaryCounts = await PageObjects.copySavedObjectsToSpace.getSummaryCounts();

      expect(updatedSummaryCounts).to.eql({
        success: 0,
        pending: 3,
        skipped: 0,
        errors: 0,
      });

      await PageObjects.copySavedObjectsToSpace.finishCopy();
    });

    it('avoids conflicts when createNewCopies is enabled', async () => {
      const destinationSpaceId = 'sales';

      await PageObjects.copySavedObjectsToSpace.openCopyToSpaceFlyoutForObject('A Dashboard');

      await PageObjects.copySavedObjectsToSpace.setupForm({
        createNewCopies: true,
        overwrite: false,
        destinationSpaceId,
      });

      await PageObjects.copySavedObjectsToSpace.startCopy();

      // Wait for successful copy
      await testSubjects.waitForDeleted(`cts-summary-indicator-loading-${destinationSpaceId}`);
      await testSubjects.existOrFail(`cts-summary-indicator-success-${destinationSpaceId}`);

      const summaryCounts = await PageObjects.copySavedObjectsToSpace.getSummaryCounts();

      expect(summaryCounts).to.eql({
        success: 3,
        pending: 0,
        skipped: 0,
        errors: 0,
      });

      await PageObjects.copySavedObjectsToSpace.finishCopy();
    });

    it('allows a dashboard to be copied to the marketing space, with circular references', async () => {
      const destinationSpaceId = 'marketing';

      await PageObjects.copySavedObjectsToSpace.openCopyToSpaceFlyoutForObject('Dashboard Foo');

      await PageObjects.copySavedObjectsToSpace.setupForm({
        createNewCopies: false,
        overwrite: true,
        destinationSpaceId,
      });

      await PageObjects.copySavedObjectsToSpace.startCopy();

      // Wait for successful copy
      await testSubjects.waitForDeleted(`cts-summary-indicator-loading-${destinationSpaceId}`);
      await testSubjects.existOrFail(`cts-summary-indicator-success-${destinationSpaceId}`);

      const summaryCounts = await PageObjects.copySavedObjectsToSpace.getSummaryCounts();

      expect(summaryCounts).to.eql({
        success: 2,
        pending: 0,
        skipped: 0,
        errors: 0,
      });

      await PageObjects.copySavedObjectsToSpace.finishCopy();
    });
  });
}
