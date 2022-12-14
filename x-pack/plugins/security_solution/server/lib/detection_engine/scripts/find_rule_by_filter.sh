#!/bin/sh

#
# Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
# or more contributor license agreements. Licensed under the Elastic License
# 2.0; you may not use this file except in compliance with the Elastic License
# 2.0.
#

set -e
./check_env_variables.sh

FILTER=${1:-'alert.attributes.enabled:%20true'}

# The %20 is just an encoded space that is typical of URL's.
# The %22 is just an encoded quote of "
# Table of them for testing if needed: https://www.w3schools.com/tags/ref_urlencode.asp

# Example get all enabled tags:
# ./find_rule_by_filter.sh "alert.attributes.enabled:%20true"

# Example get all the names that start with Detect*
# ./find_rule_by_filter.sh "alert.attributes.name:%20Detect*"

# Exampe get everything that has tag_1
# ./find_rule_by_filter.sh "alert.attributes.tags:tag_1"

# Example get all pre-packaged rules
# ./find_rule_by_filter.sh "alert.attributes.params.immutable:%20true"

# Example get all non pre-packaged rules
# ./find_rule_by_filter.sh "alert.attributes.params.immutable:%20false"

# Example get all non pre-packaged rules and a tag_1
# ./find_rule_by_filter.sh "alert.attributes.params.immutable:%20false%20AND%20alert.attributes.tags:tag_1"
curl -s -k \
 -u ${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD} \
 -X GET ${KIBANA_URL}${SPACE_URL}/api/detection_engine/rules/_find?filter=$FILTER | jq .
