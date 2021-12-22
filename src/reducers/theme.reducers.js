import { ThemeConstants } from '../constants/theme';

const currentTimeDark = () => {
  const currentdate = new Date();
  return currentdate.getHours() >= 18 || currentdate.getHours() < 6;
};

export function Theme(
  state = {
    darkMode: currentTimeDark()
  },
  action
) {
  switch (action.type) {
    case ThemeConstants.UPDATE_THEME: {
      return {
        darkMode: action.darkMode
      };
    }
    default: {
      return state;
    }
  }
}
