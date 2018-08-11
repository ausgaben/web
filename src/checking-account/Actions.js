const PREFIX = 'CHECKING_ACCOUNT';
export const FETCH = `${PREFIX}_FETCH`;
export const FETCHING = `${PREFIX}_FETCHING`;
export const ERROR = `${PREFIX}_ERROR`;
export const SELECT = `${PREFIX}_SELECT`;
export const UPDATE_SETTING = `${PREFIX}_UPDATE_SETTINGS`;

export const fetch = url => ({
  type: FETCH,
  url
});

export const error = error => ({
  type: ERROR,
  error
});

export const updateSetting = (setting, value) => ({
  type: UPDATE_SETTING,
  setting,
  value
});