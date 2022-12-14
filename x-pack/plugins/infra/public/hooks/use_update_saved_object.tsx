/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useState, useCallback } from 'react';
import {
  SavedObjectAttributes,
  SavedObjectsCreateOptions,
  SimpleSavedObject,
} from '@kbn/core/public';
import { useKibana } from '@kbn/kibana-react-plugin/public';

export const useUpdateSavedObject = (type: string) => {
  const kibana = useKibana();
  const [data, setData] = useState<SimpleSavedObject<SavedObjectAttributes> | null>(null);
  const [updatedId, setUpdatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const update = useCallback(
    (id: string, attributes: SavedObjectAttributes, options?: SavedObjectsCreateOptions) => {
      setLoading(true);
      const save = async () => {
        try {
          const savedObjectsClient = kibana.services.savedObjects?.client;
          if (!savedObjectsClient) {
            throw new Error('Saved objects client is unavailable');
          }
          const d = await savedObjectsClient.update(type, id, attributes, options);
          setUpdatedId(d.id);
          setError(null);
          setData(d);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setError(e);
        }
      };
      save();
    },
    [type, kibana.services.savedObjects]
  );

  return {
    data,
    loading,
    error,
    update,
    updatedId,
  };
};
