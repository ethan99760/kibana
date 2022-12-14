/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';
import {
  EuiFilterButton,
  EuiFilterSelectItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPopover,
  EuiSpacer,
} from '@elastic/eui';
import * as i18n from './translations';
import type { SecurityJob } from '../../types';
import { toggleSelectedGroup } from './toggle_selected_group';

interface GroupsFilterPopoverProps {
  securityJobs: SecurityJob[];
  onSelectedGroupsChanged: Dispatch<SetStateAction<string[]>>;
}

/**
 * Popover for selecting which SecurityJob groups to filter on. Component extracts unique groups and
 * their counts from the provided SecurityJobs. The 'siem' & 'security' groups are filtered out as all jobs will be
 * siem/security jobs
 *
 * @param securityJobs jobs to fetch groups from to display for filtering
 * @param onSelectedGroupsChanged change listener to be notified when group selection changes
 */
export const GroupsFilterPopoverComponent = ({
  securityJobs,
  onSelectedGroupsChanged,
}: GroupsFilterPopoverProps) => {
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const groups = securityJobs
    .map((j) => j.groups)
    .flat()
    .filter((g) => g !== 'siem' && g !== 'security');
  const uniqueGroups = Array.from(new Set(groups));

  useEffect(() => {
    onSelectedGroupsChanged(selectedGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroups.sort().join()]);

  return (
    <EuiPopover
      ownFocus
      button={
        <EuiFilterButton
          data-test-subj={'groups-filter-popover-button'}
          iconType="arrowDown"
          onClick={() => setIsGroupPopoverOpen(!isGroupPopoverOpen)}
          isSelected={isGroupPopoverOpen}
          numFilters={uniqueGroups.length}
          hasActiveFilters={selectedGroups.length > 0}
          numActiveFilters={selectedGroups.length}
        >
          {i18n.GROUPS}
        </EuiFilterButton>
      }
      isOpen={isGroupPopoverOpen}
      closePopover={() => setIsGroupPopoverOpen(!isGroupPopoverOpen)}
      panelPaddingSize="none"
      repositionOnScroll
    >
      {uniqueGroups.map((group, index) => (
        <EuiFilterSelectItem
          checked={selectedGroups.includes(group) ? 'on' : undefined}
          key={`${index}-${group}`}
          onClick={() => toggleSelectedGroup(group, selectedGroups, setSelectedGroups)}
        >
          {`${group} (${groups.filter((g) => g === group).length})`}
        </EuiFilterSelectItem>
      ))}
      {uniqueGroups.length === 0 && (
        <EuiFlexGroup gutterSize="m" justifyContent="spaceAround">
          <EuiFlexItem grow={true}>
            <EuiIcon type="minusInCircle" />
            <EuiSpacer size="xs" />
            <p>{i18n.NO_GROUPS_AVAILABLE}</p>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </EuiPopover>
  );
};

GroupsFilterPopoverComponent.displayName = 'GroupsFilterPopoverComponent';

export const GroupsFilterPopover = React.memo(GroupsFilterPopoverComponent);

GroupsFilterPopover.displayName = 'GroupsFilterPopover';
