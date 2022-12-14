#!/usr/bin/env bash

source test/scripts/jenkins_test_setup_xpack.sh

node scripts/functional_tests \
  --debug --bail \
  --kibana-install-dir "$KIBANA_INSTALL_DIR" \
  --include-tag "includeFirefox" \
  --config test/functional/config.firefox.js \
  --config test/functional_embedded/config.firefox.ts;
