/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { savedMap } from '../../../canvas_plugin_src/functions/external/saved_map';
import { FunctionHelp } from '../function_help';
import { FunctionFactory } from '../../../types';

export const help: FunctionHelp<FunctionFactory<typeof savedMap>> = {
  help: i18n.translate('xpack.canvas.functions.savedMapHelpText', {
    defaultMessage: `Returns an embeddable for a saved map object.`,
  }),
  args: {
    id: i18n.translate('xpack.canvas.functions.savedMap.args.idHelpText', {
      defaultMessage: `The ID of the saved map object`,
    }),
    center: i18n.translate('xpack.canvas.functions.savedMap.args.centerHelpText', {
      defaultMessage: `The center and zoom level the map should have`,
    }),
    hideLayer: i18n.translate('xpack.canvas.functions.savedMap.args.hideLayer', {
      defaultMessage: `The IDs of map layers that should be hidden`,
    }),
    timerange: i18n.translate('xpack.canvas.functions.savedMap.args.timerangeHelpText', {
      defaultMessage: `The timerange of data that should be included`,
    }),
    title: i18n.translate('xpack.canvas.functions.savedMap.args.titleHelpText', {
      defaultMessage: `The title for the map`,
    }),
  },
};
