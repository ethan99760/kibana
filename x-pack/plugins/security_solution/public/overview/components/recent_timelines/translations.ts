/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const FAVORITES = i18n.translate(
  'xpack.securitySolution.recentTimelines.favoritesButtonLabel',
  {
    defaultMessage: 'Favorites',
  }
);

export const NO_FAVORITE_TIMELINES = i18n.translate(
  'xpack.securitySolution.recentTimelines.noFavoriteTimelinesMessage',
  {
    defaultMessage:
      "You haven't favorited any timelines yet. Get out there and start threat hunting!",
  }
);

export const LAST_UPDATED = i18n.translate(
  'xpack.securitySolution.recentTimelines.lastUpdatedButtonLabel',
  {
    defaultMessage: 'Last updated',
  }
);

export const NO_TIMELINES = i18n.translate(
  'xpack.securitySolution.recentTimelines.noTimelinesMessage',
  {
    defaultMessage:
      "You haven't created any timelines yet. Get out there and start threat hunting!",
  }
);

export const NOTES = i18n.translate('xpack.securitySolution.recentTimelines.notesTooltip', {
  defaultMessage: 'Notes',
});

export const OPEN_AS_DUPLICATE = i18n.translate(
  'xpack.securitySolution.recentTimelines.openAsDuplicateTooltip',
  {
    defaultMessage: 'Open as a timeline duplicate',
  }
);

export const OPEN_AS_DUPLICATE_TEMPLATE = i18n.translate(
  'xpack.securitySolution.recentTimelines.openAsDuplicateTemplateTooltip',
  {
    defaultMessage: 'Open as a template duplicate',
  }
);

export const PINNED_EVENTS = i18n.translate(
  'xpack.securitySolution.recentTimelines.pinnedEventsTooltip',
  {
    defaultMessage: 'Pinned events',
  }
);

export const UNTITLED_TIMELINE = i18n.translate(
  'xpack.securitySolution.recentTimelines.untitledTimelineLabel',
  {
    defaultMessage: 'Untitled timeline',
  }
);

export const VIEW_ALL_TIMELINES = i18n.translate(
  'xpack.securitySolution.recentTimelines.viewAllTimelinesLink',
  {
    defaultMessage: 'View all timelines',
  }
);

export const TIMELINES_FILTER_CONTROL = i18n.translate(
  'xpack.securitySolution.recentTimelines.filterControlLegend',
  {
    defaultMessage: 'Timelines filter',
  }
);
