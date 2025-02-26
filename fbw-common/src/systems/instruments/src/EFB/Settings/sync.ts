// Copyright (c) 2023-2024 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import { NXDataStore, DEFAULT_RADIO_AUTO_CALL_OUTS } from '@flybywiresim/fbw-sdk';

type SimVar = [name: string, type: string, defaultValue: string];
type SimVarEnum = [name: string, type: string, defaultValue: string, map: Map<string, number>];

function syncSetting(simVar: SimVar, propertyName: string) {
  NXDataStore.getAndSubscribe(
    propertyName,
    (prop, value) => {
      SimVar.SetSimVarValue(simVar[0], simVar[1], parseInt(value)).catch((e) => console.log(propertyName, e));
    },
    simVar[2],
  );
}

function syncEnumSetting(simVarEnum: SimVarEnum, propertyName: string) {
  NXDataStore.getAndSubscribe(
    propertyName,
    (prop, value) => {
      const mapValue = simVarEnum[3].get(value);
      SimVar.SetSimVarValue(simVarEnum[0], simVarEnum[1], mapValue).catch((e) => console.log(propertyName, e));
    },
    simVarEnum[2],
  );
}
/**
 * This contains a list of NXDataStore settings that must be synced to simvars on plane load
 */
const settingsToSync: Map<string, SimVar> = new Map([
  ['SOUND_PTU_AUDIBLE_COCKPIT', ['L:A32NX_SOUND_PTU_AUDIBLE_COCKPIT', 'number', '0']],
  ['SOUND_EXTERIOR_MASTER', ['L:A32NX_SOUND_EXTERIOR_MASTER', 'number', '0']],
  ['SOUND_INTERIOR_ENGINE', ['L:A32NX_SOUND_INTERIOR_ENGINE', 'number', '0']],
  ['SOUND_INTERIOR_WIND', ['L:A32NX_SOUND_INTERIOR_WIND', 'number', '0']],
  ['EFB_BRIGHTNESS', ['L:A32NX_EFB_BRIGHTNESS', 'number', '0']],
  ['EFB_USING_AUTOBRIGHTNESS', ['L:A32NX_EFB_USING_AUTOBRIGHTNESS', 'bool', '0']],
  ['ISIS_BARO_UNIT_INHG', ['L:A32NX_ISIS_BARO_UNIT_INHG', 'number', '0']],
  ['REALISTIC_TILLER_ENABLED', ['L:A32NX_REALISTIC_TILLER_ENABLED', 'number', '0']],
  ['HOME_COCKPIT_ENABLED', ['L:A32NX_HOME_COCKPIT_ENABLED', 'number', '0']],
  ['SOUND_PASSENGER_AMBIENCE_ENABLED', ['L:A32NX_SOUND_PASSENGER_AMBIENCE_ENABLED', 'number', '1']],
  ['SOUND_ANNOUNCEMENTS_ENABLED', ['L:A32NX_SOUND_ANNOUNCEMENTS_ENABLED', 'number', '1']],
  ['SOUND_BOARDING_MUSIC_ENABLED', ['L:A32NX_SOUND_BOARDING_MUSIC_ENABLED', 'number', '1']],
  ['RADIO_RECEIVER_USAGE_ENABLED', ['L:A32NX_RADIO_RECEIVER_USAGE_ENABLED', 'number', '0']],
  ['MODEL_WHEELCHOCKS_ENABLED', ['L:A32NX_MODEL_WHEELCHOCKS_ENABLED', 'bool', '1']],
  ['MODEL_CONES_ENABLED', ['L:A32NX_MODEL_CONES_ENABLED', 'bool', '1']],
  ['FO_SYNC_EFIS_ENABLED', ['L:A32NX_FO_SYNC_EFIS_ENABLED', 'bool', '0']],
  ['MODEL_SATCOM_ENABLED', ['L:A32NX_SATCOM_ENABLED', 'bool', '0']],
  ['CONFIG_PILOT_AVATAR_VISIBLE', ['L:A32NX_PILOT_AVATAR_VISIBLE_0', 'bool', '0']],
  ['CONFIG_FIRST_OFFICER_AVATAR_VISIBLE', ['L:A32NX_PILOT_AVATAR_VISIBLE_1', 'bool', '0']],
  ['GSX_PAYLOAD_SYNC', ['L:A32NX_GSX_PAYLOAD_SYNC_ENABLED', 'bool', '0']],
  ['CONFIG_USING_METRIC_UNIT', ['L:A32NX_EFB_USING_METRIC_UNIT', 'bool', '1']],
  [
    'CONFIG_A32NX_FWC_RADIO_AUTO_CALL_OUT_PINS',
    ['L:A32NX_FWC_RADIO_AUTO_CALL_OUT_PINS', 'number', DEFAULT_RADIO_AUTO_CALL_OUTS.toString()],
  ],
  ['CONFIG_USING_PORTABLE_DEVICES', ['L:A32NX_CONFIG_USING_PORTABLE_DEVICES', 'bool', '1']],
  ['REFUEL_RATE_SETTING', ['L:A32NX_EFB_REFUEL_RATE_SETTING', 'number', '0']],
]);

const settingEnumToSync: Map<string, SimVarEnum> = new Map([
  [
    'CONFIG_BOARDING_RATE',
    [
      'L:A32NX_BOARDING_RATE',
      'number',
      'REAL',
      new Map([
        ['REAL', 2],
        ['FAST', 1],
        ['INSTANT', 0],
      ]),
    ],
  ],
  [
    'CONFIG_ALIGN_TIME',
    [
      'L:A32NX_CONFIG_ADIRS_IR_ALIGN_TIME',
      'number',
      'REAL',
      new Map([
        ['REAL', 0],
        ['FAST', 2],
        ['INSTANT', 1],
      ]),
    ],
  ],
]);

export function readSettingsFromPersistentStorage() {
  settingsToSync.forEach((simVar, propertyName) => syncSetting(simVar, propertyName));
  settingEnumToSync.forEach((simVarEnum, propertyName) => syncEnumSetting(simVarEnum, propertyName));
}
