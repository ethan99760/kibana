/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema, TypeOf } from '@kbn/config-schema';
import { PluginConfigDescriptor } from '@kbn/core/server';

const configSchema = schema.object({
  search_timeout: schema.duration({ defaultValue: '30s' }),
});

export type GlobalSearchConfigType = TypeOf<typeof configSchema>;

export const config: PluginConfigDescriptor<GlobalSearchConfigType> = {
  schema: configSchema,
  exposeToBrowser: {
    search_timeout: true,
  },
};
