#!/usr/bin/env bash

source src/dev/ci_setup/setup_env.sh

cd test/plugin_functional/plugins/kbn_sample_panel_action;
if [[ ! -d "target" ]]; then
  yarn build;
fi
cd -;
