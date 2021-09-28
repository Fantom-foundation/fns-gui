import React from 'react';
import styled from '@emotion/styled/macro';

import mq from 'mediaQuery';
import { hasNonAscii } from '../../utils/utils';

const MainContainer = styled('main')`
  margin-top: 50px;

  ${p =>
    p.hasNonAscii
      ? mq.medium`
    margin-left: 270px;
    margin-top: 250px;
  `
      : mq.medium`
    margin-left: 270px;
    margin-top: 50px;
  `}
`;

const Main = ({ children }) => (
  <MainContainer hasNonAscii={hasNonAscii()}>{children}</MainContainer>
);

export default Main;
