/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import moment from 'moment';
import { WatchHistoryItem } from './watch_history_item';

describe('watch_history_item', () => {
  describe('WatchHistoryItem', () => {
    let upstreamJson;

    beforeEach(() => {
      upstreamJson = {
        id: 'only-trigger_76220454-7e10-4088-96ca-3d77c49d34bf-2017-01-25T13:30:33.070',
        watchId: 'only-trigger',
        watchHistoryItemJson: {
          status: {
            state: {
              active: true,
            },
          },
          state: 'throttled',
          result: {
            execution_time: '2017-01-05T21:49:27.000Z',
            actions: [
              {
                id: 'test-log',
                type: 'logging',
                status: 'success',
                logging: {
                  logged_text: 'hello there, i am a test log',
                },
              },
              {
                id: 'throttled-log',
                type: 'logging',
                status: 'throttled',
                logging: {
                  logged_text: 'action [throttled-log] was acked at [2017-01-04T21:29:27.000Z]',
                },
              },
            ],
          },
        },
      };
    });

    describe('fromUpstreamJson factory method', () => {
      it('returns correct WatchHistoryItem instance', () => {
        const watchHistoryItem = WatchHistoryItem.fromUpstreamJson(upstreamJson);
        expect(watchHistoryItem).toHaveProperty('id');
        expect(watchHistoryItem).toHaveProperty('watchId');
        expect(watchHistoryItem).toHaveProperty('watchHistoryItemJson');
        expect(watchHistoryItem).toHaveProperty('includeDetails');
        expect(watchHistoryItem).toHaveProperty('details');
        expect(watchHistoryItem).toHaveProperty('startTime');
        expect(watchHistoryItem).toHaveProperty('watchStatus');

        expect(watchHistoryItem.id).toEqual(upstreamJson.id);
        expect(watchHistoryItem.watchId).toEqual(upstreamJson.watchId);
        expect(watchHistoryItem.watchHistoryItemJson).toEqual(upstreamJson.watchHistoryItemJson);
        expect(watchHistoryItem.includeDetails).toBe(false);
        expect(watchHistoryItem.details).toEqual(upstreamJson.watchHistoryItemJson);
        expect(watchHistoryItem.startTime).toBeInstanceOf(moment);
        expect(watchHistoryItem.watchStatus).toEqual({
          id: upstreamJson.watchId,
          actionStatuses: [],
          isActive: upstreamJson.watchHistoryItemJson.status.state.active,
          lastChecked: null,
          lastMetCondition: null,
          watchState: upstreamJson.watchHistoryItemJson.state,
          watchStatusJson: {
            state: {
              active: upstreamJson.watchHistoryItemJson.status.state.active,
            },
          },
          watchErrors: {},
        });
      });
    });

    describe('downstreamJson getter method', () => {
      it('returns correct downstream JSON object', () => {
        const watchHistoryItem = WatchHistoryItem.fromUpstreamJson(upstreamJson);
        const expected = {
          id: upstreamJson.id,
          watchId: upstreamJson.watchId,
          details: null,
          startTime: upstreamJson.watchHistoryItemJson.result.execution_time,
          watchStatus: {
            id: upstreamJson.watchId,
            actionStatuses: [],
            comment: '',
            isActive: upstreamJson.watchHistoryItemJson.status.state.active,
            lastChecked: null,
            lastMetCondition: null,
            lastFired: undefined,
            state: 'Active',
          },
        };
        expect(watchHistoryItem.downstreamJson).toEqual(expected);
      });
    });
  });
});
