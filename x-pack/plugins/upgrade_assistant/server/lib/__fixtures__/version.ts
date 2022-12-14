/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { SemVer } from 'semver';

const kibanaVersion = new SemVer('8.0.0');

export const getMockVersionInfo = () => {
  const currentMajor = kibanaVersion.major;

  return {
    currentVersion: kibanaVersion,
    currentMajor,
    prevMajor: currentMajor - 1,
    nextMajor: currentMajor + 1,
  };
};
