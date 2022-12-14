#!/usr/bin/env bash

source test/scripts/jenkins_test_setup_xpack.sh

if [[ -z "$CODE_COVERAGE" ]]; then
  echo " -> Running functional and api tests"

  node scripts/functional_tests \
    --debug --bail \
    --kibana-install-dir "$KIBANA_INSTALL_DIR" \
    --include-tag "ciGroup$CI_GROUP"

  echo ""
  echo ""
else
  echo " -> Running X-Pack functional tests with code coverage"
  export NODE_OPTIONS=--max_old_space_size=8192

  echo " -> making hard link clones"
  cd ..
  cp -RlP kibana "kibana${CI_GROUP}"
  cd "kibana${CI_GROUP}/x-pack"

  echo " -> running tests from the clone folder"
  node scripts/functional_tests --debug --include-tag "ciGroup$CI_GROUP"  --exclude-tag "skipCoverage" || true;

  echo " -> moving junit output, silently fail in case of no report"
  mkdir -p ../../kibana/target/junit
  mv ../target/junit/* ../../kibana/target/junit/ || echo "copying junit failed"

  echo " -> copying screenshots and html for failures"
  cp -r test/functional/screenshots/* ../../kibana/x-pack/test/functional/screenshots/ || echo "copying screenshots failed"
  cp -r test/functional/failure_debug ../../kibana/x-pack/test/functional/ || echo "copying html failed"
fi
