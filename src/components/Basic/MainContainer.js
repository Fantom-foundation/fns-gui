import styled from '@emotion/styled/macro';
import mq from 'mediaQuery';

const MainContainer = styled('div')`
  background: ${p => p.theme.colors.componentBgColor};
  border-radius: 16px;

  position: relative;
  overflow: hidden;
  padding-top: 20px;
`;

export default MainContainer;
