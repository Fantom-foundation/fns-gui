import React, { useContext } from 'react';
import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';
import mq from 'mediaQuery';

import FNSLogo from '../assets/fnsIconLogo.svg';
import FNSLogoLight from '../assets/fnsIconLogoLight.svg';
import LogoTyped from '../assets/TypeLogo';
import GlobalState from '../globalState';

const IconLogo = styled('img')`
  width: 30px;
  margin-right: 7px;
  ${mq.medium`
    width: 34px
  `}
`;

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: auto;

  ${mq.medium`
    width: 200px;
  `}
`;

const Logo = ({ color, className, to = '' }) => {
  const { darkMode } = useContext(GlobalState);
  return (
    <LogoContainer className={className} to={to}>
      <IconLogo src={darkMode ? FNSLogo : FNSLogoLight} />
    </LogoContainer>
  );
};

export default Logo;
