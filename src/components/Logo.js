import React from 'react';
import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';
import mq from 'mediaQuery';

import FNSLogo from '../assets/fnsIconLogo.svg';
import LogoTyped from '../assets/TypeLogo';

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

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={FNSLogo} />
  </LogoContainer>
);

export default Logo;
