import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from '@emotion/styled/macro';
import { useLocalStorage } from '../hooks';
import GlobalState from '../../globalState';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';

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
  const { changeColorMode } = useContext(GlobalState);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

  const toggleMode = () => {
    var mode = !darkMode;
    setDarkMode(mode);
    location.reload();
  };

  return (
    <ModeToggler onClick={toggleMode}>
      <img src={darkMode ? sun : moon} />
    </ModeToggler>
  );
};

export default ThemeToggler;
