/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';

export default function ({ getService }) {
  const supertest = getService('supertest');
  const esSupertest = getService('esSupertest');
  const esDeleteAllIndices = getService('esDeleteAllIndices');

  describe('update collection_enabled setting', () => {
    after(async () => {
      // turn off collection
      const disableCollection = {
        persistent: {
          xpack: {
            monitoring: {
              collection: {
                enabled: false,
              },
            },
          },
        },
      };

      await esSupertest.put('/_cluster/settings').send(disableCollection).expect(200);
      await esDeleteAllIndices('.monitoring-*');
    });

    it('should set collection.enabled to true', async () => {
      const { body } = await supertest
        .put('/api/monitoring/v1/elasticsearch_settings/set/collection_enabled')
        .set('kbn-xsrf', 'xxx')
        .expect(200);

      expect(body).to.eql({
        // returns same response every run
        acknowledged: true,
        persistent: {
          xpack: { monitoring: { collection: { enabled: 'true' } } },
        },
        transient: {},
      });
    });
  });
}
