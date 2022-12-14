/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';

export default function ({ getService, getPageObjects }) {
  const PageObjects = getPageObjects(['common', 'maps', 'timePicker']);
  const security = getService('security');
  const from = 'Mar 1, 2015 @ 00:00:00.000';
  const to = 'Mar 1, 2016 @ 00:00:00.000';

  describe('vector styling', () => {
    before(async () => {
      await security.testUser.setRoles(['test_logstash_reader', 'global_maps_all']);
      await PageObjects.maps.loadSavedMap('document example');
      await PageObjects.common.setTime({ from, to });
    });

    after(async () => {
      await PageObjects.maps.refreshAndClearUnsavedChangesWarning();
      await security.testUser.restoreDefaults();
      await PageObjects.common.unsetTime();
    });

    describe('categorical styling', () => {
      before(async () => {
        await PageObjects.maps.openLayerPanel('logstash');
      });

      it('should provide auto complete suggestions', async () => {
        await PageObjects.maps.setStyleByValue('fillColor', 'machine.os.raw');
        await PageObjects.maps.selectCustomColorRamp('fillColor');
        const suggestions = await PageObjects.maps.getCategorySuggestions();
        expect(suggestions.trim().split('\n').join()).to.equal('ios,osx,win 7,win 8,win xp');
      });
    });
  });
}
