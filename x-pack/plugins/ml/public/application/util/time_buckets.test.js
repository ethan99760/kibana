/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import moment from 'moment';
import { UI_SETTINGS } from '@kbn/data-plugin/public';
import { TimeBuckets, getBoundsRoundedToInterval, calcEsInterval } from './time_buckets';

describe('ML - time buckets', () => {
  let autoBuckets;
  let customBuckets;

  beforeEach(() => {
    const timeBucketsConfig = {
      [UI_SETTINGS.HISTOGRAM_MAX_BARS]: 100,
      [UI_SETTINGS.HISTOGRAM_BAR_TARGET]: 50,
    };

    autoBuckets = new TimeBuckets(timeBucketsConfig);
    autoBuckets.setInterval('auto');

    customBuckets = new TimeBuckets(timeBucketsConfig);
    customBuckets.setInterval('auto');
    customBuckets.setBarTarget(500);
    customBuckets.setMaxBars(550);
  });

  describe('default bar target', () => {
    test('returns correct interval for default target with hour bounds', () => {
      const hourBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-01T01:00:00.000'),
      };
      autoBuckets.setBounds(hourBounds);
      const hourResult = autoBuckets.getInterval();
      expect(hourResult.asSeconds()).toBe(60); // 1 minute
    });

    test('returns correct interval for default target with day bounds', () => {
      const dayBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-02T00:00:00.000'),
      };
      autoBuckets.setBounds(dayBounds);
      const dayResult = autoBuckets.getInterval();
      expect(dayResult.asSeconds()).toBe(1800); // 30 minutes
    });

    test('returns correct interval for default target with week bounds', () => {
      const weekBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-08T00:00:00.000'),
      };
      autoBuckets.setBounds(weekBounds);
      const weekResult = autoBuckets.getInterval();
      expect(weekResult.asSeconds()).toBe(14400); // 4 hours
    });

    test('returns correct interval for default target with 30 day bounds', () => {
      const monthBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-31T00:00:00.000'),
      };
      autoBuckets.setBounds(monthBounds);
      const monthResult = autoBuckets.getInterval();
      expect(monthResult.asSeconds()).toBe(86400); // 1 day
    });

    test('returns correct interval for default target with year bounds', () => {
      const yearBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2018-01-01T00:00:00.000'),
      };
      autoBuckets.setBounds(yearBounds);
      const yearResult = autoBuckets.getInterval();
      expect(yearResult.asSeconds()).toBe(604800); // 1 week
    });

    test('returns correct interval as multiple of 3 hours for default target with 2 week bounds', () => {
      const weekBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-15T00:00:00.000'),
      };
      autoBuckets.setBounds(weekBounds);
      const weekResult = autoBuckets.getIntervalToNearestMultiple(10800); // 3 hours
      expect(weekResult.asSeconds()).toBe(32400); // 9 hours
    });
  });

  describe('custom bar target', () => {
    test('returns correct interval for 500 bar target with hour bounds', () => {
      const hourBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-01T01:00:00.000'),
      };
      customBuckets.setBounds(hourBounds);
      const hourResult = customBuckets.getInterval();
      expect(hourResult.asSeconds()).toBe(10); // 10 seconds
    });

    test('returns correct interval for 500 bar target with day bounds', () => {
      const dayBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-02T00:00:00.000'),
      };
      customBuckets.setBounds(dayBounds);
      const dayResult = customBuckets.getInterval();
      expect(dayResult.asSeconds()).toBe(300); // 5 minutes
    });

    test('returns correct interval for 500 bar target with week bounds', () => {
      const weekBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-08T00:00:00.000'),
      };
      customBuckets.setBounds(weekBounds);
      const weekResult = customBuckets.getInterval();
      expect(weekResult.asSeconds()).toBe(1800); // 30 minutes
    });

    test('returns correct interval for 500 bar target with 30 day bounds', () => {
      const monthBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-01-31T00:00:00.000'),
      };
      customBuckets.setBounds(monthBounds);
      const monthResult = customBuckets.getInterval();
      expect(monthResult.asSeconds()).toBe(7200); // 2 hours
    });

    test('returns correct interval for 500 bar target with year bounds', () => {
      const yearBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2018-01-01T00:00:00.000'),
      };
      customBuckets.setBounds(yearBounds);
      const yearResult = customBuckets.getInterval();
      expect(yearResult.asSeconds()).toBe(86400); // 1 day
    });

    test('returns correct interval as multiple of 3 hours for 500 bar target with 90 day bounds', () => {
      const weekBounds = {
        min: moment('2017-01-01T00:00:00.000'),
        max: moment('2017-04-01T00:00:00.000'),
      };
      customBuckets.setBounds(weekBounds);
      const weekResult = customBuckets.getIntervalToNearestMultiple(10800); // 3 hours
      expect(weekResult.asSeconds()).toBe(21600); // 6 hours
    });
  });

  describe('getBoundsRoundedToInterval', () => {
    // Must include timezone when creating moments for this test to ensure
    // checks are correct when running tests in different timezones.
    const testBounds = {
      min: moment('2017-01-05T10:11:12.000+00:00'),
      max: moment('2017-10-26T09:08:07.000+00:00'),
    };

    test('returns correct bounds for 4h interval without inclusive end', () => {
      const bounds4h = getBoundsRoundedToInterval(testBounds, moment.duration(4, 'hours'), false);
      expect(bounds4h.min.valueOf()).toBe(moment('2017-01-05T08:00:00.000+00:00').valueOf());
      expect(bounds4h.max.valueOf()).toBe(moment('2017-10-26T11:59:59.999+00:00').valueOf());
    });

    test('returns correct bounds for 4h interval with inclusive end', () => {
      const bounds4h = getBoundsRoundedToInterval(testBounds, moment.duration(4, 'hours'), true);
      expect(bounds4h.min.valueOf()).toBe(moment('2017-01-05T08:00:00.000+00:00').valueOf());
      expect(bounds4h.max.valueOf()).toBe(moment('2017-10-26T12:00:00.000+00:00').valueOf());
    });

    test('returns correct bounds for 1d interval without inclusive end', () => {
      const bounds4h = getBoundsRoundedToInterval(testBounds, moment.duration(1, 'days'), false);
      expect(bounds4h.min.valueOf()).toBe(moment('2017-01-05T00:00:00.000+00:00').valueOf());
      expect(bounds4h.max.valueOf()).toBe(moment('2017-10-26T23:59:59.999+00:00').valueOf());
    });

    test('returns correct bounds for 1d interval with inclusive end', () => {
      const bounds4h = getBoundsRoundedToInterval(testBounds, moment.duration(1, 'days'), true);
      expect(bounds4h.min.valueOf()).toBe(moment('2017-01-05T00:00:00.000+00:00').valueOf());
      expect(bounds4h.max.valueOf()).toBe(moment('2017-10-27T00:00:00.000+00:00').valueOf());
    });
  });

  describe('calcEsInterval', () => {
    test('returns correct interval for various durations', () => {
      expect(calcEsInterval(moment.duration(500, 'ms'))).toEqual({
        value: 500,
        unit: 'ms',
        expression: '500ms',
      });
      expect(calcEsInterval(moment.duration(1000, 'ms'))).toEqual({
        value: 1,
        unit: 's',
        expression: '1s',
      });
      expect(calcEsInterval(moment.duration(15, 's'))).toEqual({
        value: 15,
        unit: 's',
        expression: '15s',
      });
      expect(calcEsInterval(moment.duration(60, 's'))).toEqual({
        value: 1,
        unit: 'm',
        expression: '1m',
      });
      expect(calcEsInterval(moment.duration(1, 'm'))).toEqual({
        value: 1,
        unit: 'm',
        expression: '1m',
      });
      expect(calcEsInterval(moment.duration(60, 'm'))).toEqual({
        value: 1,
        unit: 'h',
        expression: '1h',
      });
      expect(calcEsInterval(moment.duration(3, 'h'))).toEqual({
        value: 3,
        unit: 'h',
        expression: '3h',
      });
      expect(calcEsInterval(moment.duration(24, 'h'))).toEqual({
        value: 1,
        unit: 'd',
        expression: '1d',
      });
      expect(calcEsInterval(moment.duration(3, 'd'))).toEqual({
        value: 3,
        unit: 'd',
        expression: '3d',
      });
      expect(calcEsInterval(moment.duration(7, 'd'))).toEqual({
        value: 7,
        unit: 'd',
        expression: '7d',
      });
      expect(calcEsInterval(moment.duration(1, 'w'))).toEqual({
        value: 7,
        unit: 'd',
        expression: '7d',
      });
      expect(calcEsInterval(moment.duration(4, 'w'))).toEqual({
        value: 28,
        unit: 'd',
        expression: '28d',
      });
      expect(calcEsInterval(moment.duration(1, 'M'))).toEqual({
        value: 30,
        unit: 'd',
        expression: '30d',
      });
      expect(calcEsInterval(moment.duration(12, 'M'))).toEqual({
        value: 365,
        unit: 'd',
        expression: '365d',
      });
      expect(calcEsInterval(moment.duration(1, 'y'))).toEqual({
        value: 365,
        unit: 'd',
        expression: '365d',
      });
    });
  });
});
