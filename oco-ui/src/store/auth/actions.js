import * as types from './actionTypes';
import authService from '../../services/auth';
import * as errorActions from '../error/actions';

export function checkWhiteList() {
  return async(dispatch, getState) => {
    try {
      const result = await authService.checkWhiteList();
      dispatch({ type: types.SET_WHITELIST_STATUS, status: Boolean(result) });
      if (result) {
        dispatch(fetchOktaConfig());
      }
    } catch (error) {
      dispatch({ type: types.SET_WHITELIST_ERROR, error: error.message });
    }
  };
}

export function whitelist(token) {
  return async(dispatch, getState) => {
    try {
      await authService.whitelist(token);
      dispatch({ type: types.SET_WHITELIST_STATUS, status: true });
      dispatch(fetchOktaConfig());
    } catch (error) {
      dispatch({ type: types.SET_WHITELIST_ERROR, error: error.message });
    }
  };
}

export function clearWhitelist() {
  return async(dispatch, getState) => {
    try {
      await authService.clearWhiteList();
      dispatch({ type: types.SET_WHITELIST_STATUS, status: false });
    } catch (error) {
      dispatch({ type: types.SET_WHITELIST_ERROR, error: error.message });
    }
  };
}

export function fetchOktaConfig() {
  return wrappedRequest(
    () => authService.config(),
    config => ({ type: types.SET_OKTA_CONFIG, config }),
    error => errorActions.addBackground("Could not fetch authentication data " + error.message, "auth-config"),
    () => errorActions.clearBackground("auth-config")
  );
}

export function logout() {
  return ({ type: types.LOGOUT });
}

export function setToken(token, userName) {
  return { type: types.SET_TOKEN, token, userName };
}

export function handleHttpResponse(response) {
  if (response.status === 403) {
    return { type: types.SET_WHITELIST_EXPIRED };
  } else if (response.status === 401) {
    return { type: types.INVALIDATE_LOGIN };
  }
  return null;
}

export function wrappedRequest(apiRequest, jsonHandler, errorHandler, onSuccess) {
  return async(dispatch, getState) => {
    try {
      const response = await apiRequest(getState().auth);
      if (!response.ok) {
        const authAction = handleHttpResponse(response);
        if (authAction !== null) {
          dispatch(authAction);
        } else {
          throw new Error(response.statusText ? response.statusText : "Server error (" + response.status + ")");
        }
      } else {
        if (onSuccess)
          dispatch(onSuccess());
        if (jsonHandler)
          dispatch(jsonHandler(await response.json()));
      }
    } catch (error) {
      if (errorHandler)
        dispatch(errorHandler(error));
    }
  };
}