/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { httpServiceMock } from '@kbn/core/public/mocks';
import { muteAlertInstance } from './mute_alert';

const http = httpServiceMock.createStartContract();

describe('muteAlertInstance', () => {
  test('should call mute instance alert API', async () => {
    const result = await muteAlertInstance({ http, id: '1/', instanceId: '12/3' });
    expect(result).toEqual(undefined);
    expect(http.post.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "/api/alerting/rule/1%2F/alert/12%2F3/_mute",
        ],
      ]
    `);
  });
});
