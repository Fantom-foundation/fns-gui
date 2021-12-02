import React from 'react';
import styled from '@emotion/styled/macro';

import mq from 'mediaQuery';
import { hasNonAscii } from '../../utils/utils';

const MainContainer = styled('main')`
  padding-top: 20px;

  ${p =>
    p.hasNonAscii
      ? mq.medium`
    margin-left: 270px;
    padding-top: 250px;
  `
      : mq.medium`
    margin-left: 270px;
  `}
`;

const Main = ({ children }) => (
  <MainContainer hasNonAscii={hasNonAscii()}>{children}</MainContainer>
);

export default Main;
