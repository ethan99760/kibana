/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiFormRow } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';

import { EDITOR } from '../../../common/constants';
import { EuiCodeEditor } from '../../shared_imports';

export function EventInput({ value, onChange }) {
  return (
    <EuiFormRow
      label={
        <FormattedMessage id="xpack.grokDebugger.sampleDataLabel" defaultMessage="Sample Data" />
      }
      fullWidth
      data-test-subj="aceEventInput"
    >
      <EuiCodeEditor
        width="100%"
        theme="textmate"
        mode="text"
        value={value}
        onChange={onChange}
        setOptions={{
          highlightActiveLine: false,
          highlightGutterLine: false,
          minLines: EDITOR.SAMPLE_DATA_MIN_LINES,
          maxLines: EDITOR.SAMPLE_DATA_MAX_LINES,
        }}
      />
    </EuiFormRow>
  );
}
