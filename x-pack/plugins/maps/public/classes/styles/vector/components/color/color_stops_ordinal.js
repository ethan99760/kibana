/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { ColorStops } from './color_stops';
import { EuiFieldNumber } from '@elastic/eui';
import {
  addOrdinalRow,
  isOrdinalStopInvalid,
  isOrdinalStopsInvalid,
  DEFAULT_CUSTOM_COLOR,
} from './color_stops_utils';
import { i18n } from '@kbn/i18n';

export const ColorStopsOrdinal = ({
  colorStops = [{ stop: 0, color: DEFAULT_CUSTOM_COLOR }],
  onChange,
  swatches,
}) => {
  const getStopError = (stop, index) => {
    let error;
    if (isOrdinalStopInvalid(stop)) {
      error = i18n.translate('xpack.maps.styles.colorStops.ordinalStop.numberWarningLabel', {
        defaultMessage: 'Stop must be a number',
      });
    } else if (index !== 0 && colorStops[index - 1].stop >= stop) {
      error = i18n.translate(
        'xpack.maps.styles.colorStops.ordinalStop.numberOrderingWarningLabel',
        {
          defaultMessage: 'Stop must be greater than previous stop value',
        }
      );
    }
    return error;
  };

  const renderStopInput = (stop, onStopChange, index) => {
    function handleOnChangeEvent(event) {
      const sanitizedValue = parseFloat(event.target.value);
      const newStopValue = isNaN(sanitizedValue) ? '' : sanitizedValue;
      onStopChange(newStopValue);
    }
    return (
      <EuiFieldNumber
        aria-label={i18n.translate('xpack.maps.styles.colorStops.ordinalStop.stopLabel', {
          defaultMessage: 'Stop',
        })}
        value={index === 0 ? '' : stop}
        onChange={handleOnChangeEvent}
        compressed
        disabled={index === 0}
      />
    );
  };

  return (
    <ColorStops
      onChange={onChange}
      colorStops={colorStops}
      isStopsInvalid={isOrdinalStopsInvalid}
      getStopError={getStopError}
      renderStopInput={renderStopInput}
      addNewRow={addOrdinalRow}
      swatches={swatches}
    />
  );
};

ColorStopsOrdinal.propTypes = {
  /**
   * Array of { stop, color }.
   * Stops are numbers in strictly ascending order.
   * The range is from the given stop number (inclusive) to the next stop number (exclusive).
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
};
