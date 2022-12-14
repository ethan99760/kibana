/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { badRequest } from '@hapi/boom';
import { get, cloneDeep } from 'lodash';
import { i18n } from '@kbn/i18n';

import { getMoment } from '../../../common/lib/get_moment';
import { buildServerWatchStatusModel, buildClientWatchStatusModel } from '../watch_status_model';

export class WatchHistoryItem {
  constructor(props) {
    this.id = props.id;
    this.watchId = props.watchId;
    this.watchHistoryItemJson = props.watchHistoryItemJson;
    this.includeDetails = Boolean(props.includeDetails);

    this.details = cloneDeep(this.watchHistoryItemJson);
    this.startTime = getMoment(get(this.watchHistoryItemJson, 'result.execution_time'));

    const watchStatusJson = get(this.watchHistoryItemJson, 'status');
    const state = get(this.watchHistoryItemJson, 'state');
    this.watchStatus = buildServerWatchStatusModel({
      id: this.watchId,
      watchStatusJson,
      state,
    });
  }

  get downstreamJson() {
    return {
      id: this.id,
      watchId: this.watchId,
      details: this.includeDetails ? this.details : null,
      startTime: this.startTime.toISOString(),
      watchStatus: buildClientWatchStatusModel(this.watchStatus),
    };
  }

  // generate object from elasticsearch response
  static fromUpstreamJson(json, opts) {
    if (!json.id) {
      throw badRequest(
        i18n.translate('xpack.watcher.models.watchHistoryItem.idPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {id} property',
          values: {
            id: 'id',
          },
        })
      );
    }
    if (!json.watchId) {
      throw badRequest(
        i18n.translate(
          'xpack.watcher.models.watchHistoryItem.watchIdPropertyMissingBadRequestMessage',
          {
            defaultMessage: 'JSON argument must contain a {watchId} property',
            values: {
              watchId: 'watchId',
            },
          }
        )
      );
    }
    if (!json.watchHistoryItemJson) {
      throw badRequest(
        i18n.translate(
          'xpack.watcher.models.watchHistoryItem.watchHistoryItemJsonPropertyMissingBadRequestMessage',
          {
            defaultMessage: 'JSON argument must contain a {watchHistoryItemJson} property',
            values: {
              watchHistoryItemJson: 'watchHistoryItemJson',
            },
          }
        )
      );
    }

    const props = { ...json, ...opts };
    return new WatchHistoryItem(props);
  }
}
