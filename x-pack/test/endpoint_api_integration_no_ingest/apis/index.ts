/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrProviderContext } from '../ftr_provider_context';

export default function endpointAPIIntegrationTests({ loadTestFile }: FtrProviderContext) {
  // Failing ES snapshot promotion: https://github.com/elastic/kibana/issues/70535
  describe.skip('Endpoint plugin', function () {
    loadTestFile(require.resolve('./metadata'));
  });
}
