import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled/macro';
import { useDispatch, useSelector } from 'react-redux';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import ThemeActions from '../../actions/theme.actions';

const ModeToggler = styled('div')`
  background: ${p => p.theme.colors.componentBgColor};
  border-radius: 16px;
  width: 54px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ThemeToggler = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.Theme);

  const toggleMode = () => {
    var mode = !darkMode;
    dispatch(ThemeActions.updateTheme(mode));
  };

  return (
    <ModeToggler onClick={toggleMode}>
      <img src={darkMode ? sun : moon} />
    </ModeToggler>
  );
};

export default ThemeToggler;
