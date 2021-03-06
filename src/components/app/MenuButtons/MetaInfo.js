/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
import * as React from 'react';

import { MetaOverheadStatistics } from './MetaOverheadStatistics';
import {
  getProfile,
  getSymbolicationStatus,
} from 'firefox-profiler/selectors/profile';
import { resymbolicateProfile } from 'firefox-profiler/actions/receive-profile';

import {
  formatBytes,
  formatTimestamp,
} from 'firefox-profiler/utils/format-numbers';
import {
  formatProductAndVersion,
  formatPlatform,
} from 'firefox-profiler/profile-logic/profile-metainfo';

import { assertExhaustiveCheck } from 'firefox-profiler/utils/flow';
import explicitConnect from 'firefox-profiler/utils/connect';

import type { Profile, SymbolicationStatus } from 'firefox-profiler/types';
import type { ConnectedProps } from 'firefox-profiler/utils/connect';

import './MetaInfo.css';

type StateProps = $ReadOnly<{|
  profile: Profile,
  symbolicationStatus: SymbolicationStatus,
|}>;

type DispatchProps = $ReadOnly<{|
  resymbolicateProfile: typeof resymbolicateProfile,
|}>;

type Props = ConnectedProps<{||}, StateProps, DispatchProps>;

/**
 * This component formats the profile's meta information into a dropdown panel.
 */
class MetaInfoPanelImpl extends React.PureComponent<Props> {
  /**
   * This method provides information about the symbolication status, and a button
   * to re-trigger symbolication.
   */
  renderSymbolication() {
    const { profile, symbolicationStatus, resymbolicateProfile } = this.props;
    const isSymbolicated = profile.meta.symbolicated;

    switch (symbolicationStatus) {
      case 'DONE':
        return (
          <>
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Symbols:</span>
              {isSymbolicated
                ? 'Profile is symbolicated'
                : 'Profile is not symbolicated'}
            </div>
            <div className="metaInfoRow">
              <span className="metaInfoLabel"></span>
              <button
                onClick={resymbolicateProfile}
                type="button"
                className="photon-button photon-button-micro"
              >
                {isSymbolicated
                  ? 'Re-symbolicate profile'
                  : 'Symbolicate profile'}
              </button>
            </div>
          </>
        );
      case 'SYMBOLICATING':
        return (
          <div className="metaInfoRow">
            <span className="metaInfoLabel">Symbols:</span>
            {isSymbolicated
              ? 'Attempting to re-symbolicate profile'
              : 'Currently symbolicating profile'}
          </div>
        );
      default:
        throw assertExhaustiveCheck(
          symbolicationStatus,
          'Unhandled SymbolicationStatus.'
        );
    }
  }

  render() {
    const { meta, profilerOverhead } = this.props.profile;
    const { configuration } = meta;

    const platformInformation = formatPlatform(meta);

    let cpuCount = null;
    if (meta.physicalCPUs || meta.logicalCPUs) {
      let physicalCPUs = null;
      let logicalCPUs = null;
      if (meta.physicalCPUs) {
        physicalCPUs =
          meta.physicalCPUs +
          ' physical ' +
          (meta.physicalCPUs === 1 ? 'core' : 'cores');
      }
      if (meta.logicalCPUs) {
        logicalCPUs =
          meta.logicalCPUs +
          ' logical ' +
          (meta.logicalCPUs === 1 ? 'core' : 'cores');
      }
      cpuCount = (
        <div className="metaInfoRow">
          <span className="metaInfoLabel">CPU:</span>
          {physicalCPUs}
          {physicalCPUs && logicalCPUs ? ', ' : null}
          {logicalCPUs}
        </div>
      );
    }

    return (
      <>
        <div className="metaInfoSection">
          {meta.startTime ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Recording started:</span>
              {_formatDate(meta.startTime)}
            </div>
          ) : null}
          {meta.interval ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Interval:</span>
              {formatTimestamp(meta.interval, 4, 1)}
            </div>
          ) : null}
          {meta.preprocessedProfileVersion ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Profile Version:</span>
              {meta.preprocessedProfileVersion}
            </div>
          ) : null}
          {configuration ? (
            <>
              <div className="metaInfoRow">
                <span className="metaInfoLabel">Buffer Capacity:</span>
                {/* The capacity is expressed in "entries", where 1 entry == 8 bytes. */
                formatBytes(configuration.capacity * 8, 0)}
              </div>
              <div className="metaInfoRow">
                <span className="metaInfoLabel">Buffer Duration:</span>
                {configuration.duration
                  ? `${configuration.duration} seconds`
                  : 'Unlimited'}
              </div>
              <div className="metaInfoSection">
                {_renderRowOfList('Features', configuration.features)}
                {_renderRowOfList('Threads Filter', configuration.threads)}
              </div>
            </>
          ) : null}
          {this.renderSymbolication()}
        </div>
        <h2 className="metaInfoSubTitle">Application</h2>
        <div className="metaInfoSection">
          {meta.product ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Name and version:</span>
              {formatProductAndVersion(meta)}
            </div>
          ) : null}
          {meta.updateChannel ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Update Channel:</span>
              {meta.updateChannel}
            </div>
          ) : null}
          {meta.appBuildID ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Build ID:</span>
              {meta.sourceURL ? (
                <a
                  href={meta.sourceURL}
                  title={meta.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {meta.appBuildID}
                </a>
              ) : (
                meta.appBuildID
              )}
            </div>
          ) : null}
          {meta.debug !== undefined ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">Build Type:</span>
              {meta.debug ? 'Debug' : 'Opt'}
            </div>
          ) : null}
          {meta.extensions
            ? _renderRowOfList('Extensions', meta.extensions.name)
            : null}
        </div>
        <h2 className="metaInfoSubTitle">Platform</h2>
        <div className="metaInfoSection">
          {platformInformation ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">OS:</span>
              {platformInformation}
            </div>
          ) : null}
          {meta.abi ? (
            <div className="metaInfoRow">
              <span className="metaInfoLabel">ABI:</span>
              {meta.abi}
            </div>
          ) : null}
          {cpuCount}
        </div>
        {meta.visualMetrics ? (
          <>
            <h2 className="metaInfoSubTitle">Visual Metrics</h2>
            <div className="metaInfoSection">
              <div className="metaInfoRow">
                <span className="visualMetricsLabel">Speed Index:</span>
                {meta.visualMetrics.SpeedIndex}
              </div>
              <div className="metaInfoRow">
                <span className="visualMetricsLabel">
                  Perceptual Speed Index:
                </span>
                {meta.visualMetrics.PerceptualSpeedIndex}
              </div>
              <div className="metaInfoRow">
                <span className="visualMetricsLabel">
                  Contentful Speed Index:
                </span>
                {meta.visualMetrics.ContentfulSpeedIndex}
              </div>
            </div>
          </>
        ) : null}
        {/*
              Older profiles(before FF 70) don't have any overhead info.
              Don't show anything if that's the case.
            */}
        {profilerOverhead ? (
          <MetaOverheadStatistics profilerOverhead={profilerOverhead} />
        ) : null}
      </>
    );
  }
}

function _renderRowOfList(label: string, data: string[]): React.Node {
  if (!data.length) {
    return null;
  }
  return (
    <div className="metaInfoRow">
      <span className="metaInfoLabel">{label}:</span>
      <ul className="metaInfoList">
        {data.map(d => (
          <li className="metaInfoListItem" key={d}>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function _formatDate(timestamp: number): string {
  const timestampDate = new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
  return timestampDate;
}

export const MetaInfoPanel = explicitConnect<{||}, StateProps, DispatchProps>({
  mapStateToProps: state => ({
    profile: getProfile(state),
    symbolicationStatus: getSymbolicationStatus(state),
  }),
  mapDispatchToProps: {
    resymbolicateProfile,
  },
  component: MetaInfoPanelImpl,
});
