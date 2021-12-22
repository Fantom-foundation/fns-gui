import { ThemeConstants } from '../constants/theme';

const ThemeActions = {
  updateTheme
};

function updateTheme(darkMode) {
  return dispatch => {
    dispatch(_updateTheme(darkMode));
  };
}

const _updateTheme = darkMode => {
  return {
    type: ThemeConstants.UPDATE_THEME,
    darkMode
  };
};

export default ThemeActions;
