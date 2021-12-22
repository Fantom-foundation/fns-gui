import { configureStore } from '@reduxjs/toolkit';
import { Theme } from '../reducers/theme.reducers';

export default configureStore({
  reducer: {
    Theme: Theme
  }
});
