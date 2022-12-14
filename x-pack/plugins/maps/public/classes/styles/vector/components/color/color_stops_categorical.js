/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  addCategoricalRow,
  isCategoricalStopsInvalid,
  DEFAULT_CUSTOM_COLOR,
} from './color_stops_utils';
import { i18n } from '@kbn/i18n';
import { ColorStops } from './color_stops';
import { StopInput } from '../stop_input';

export const ColorStopsCategorical = ({
  colorStops = [{ stop: '', color: DEFAULT_CUSTOM_COLOR }],
  field,
  onChange,
  getValueSuggestions,
  swatches,
}) => {
  const getStopError = (stop, index) => {
    let count = 0;
    for (let i = 1; i < colorStops.length; i++) {
      if (colorStops[i].stop === stop && i !== index) {
        count++;
      }
    }

    return count
      ? i18n.translate('xpack.maps.styles.colorStops.categoricalStop.noDupesWarningLabel', {
          defaultMessage: 'Stop values must be unique',
        })
      : null;
  };

  const renderStopInput = (stop, onStopChange, index) => {
    const stopValue = typeof stop === 'string' ? stop : '';
    return (
      <StopInput
        key={field.getName()} // force new component instance when field changes
        field={field}
        getValueSuggestions={getValueSuggestions}
        value={stopValue}
        onChange={onStopChange}
        dataTestSubj={`colorStopInput${index}`}
      />
    );
  };

  return (
    <ColorStops
      onChange={onChange}
      colorStops={colorStops}
      isStopsInvalid={isCategoricalStopsInvalid}
      getStopError={getStopError}
      renderStopInput={renderStopInput}
      addNewRow={addCategoricalRow}
      swatches={swatches}
    />
  );
};

ColorStopsCategorical.propTypes = {
  /**
   * Array of { stop, color }.
   * Stops are any strings
   * Stops cannot include duplicates
   * Colors are color hex strings (3 or 6 character).
   */
  colorStops: PropTypes.arrayOf(
    PropTypes.shape({
      stopKey: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  /**
   * Callback for when the color stops changes. Called with { colorStops, isInvalid }
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Callback for fetching stop value suggestions. Called with query.
   */
  getValueSuggestions: PropTypes.func.isRequired,
};
