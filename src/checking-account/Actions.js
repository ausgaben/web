const PREFIX = 'CHECKING_ACCOUNT';
export const FETCH = `${PREFIX}_FETCH`;
export const FETCHING = `${PREFIX}_FETCHING`;
export const FETCH_FAILED = `${PREFIX}_FETCH_FAILED`;
export const FETCHED = `${PREFIX}_FETCHED`;
export const UPDATE_SETTINGS = `${PREFIX}_UPDATE_SETTINGS`;

export const fetch = id => ({
  type: FETCH,
  id
});

export const fetchFailed = error => ({
  type: FETCH_FAILED,
  error
});

export const fetched = item => ({
  type: FETCHED,
  item
});

export const fetching = () => ({
  type: FETCHING
});

export const updateSettings = (item, settings) => ({
  type: UPDATE_SETTINGS,
  item,
  settings
});
