#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/util.sh"
download_artifact "$@"
