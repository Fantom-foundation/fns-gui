import styled from '@emotion/styled/macro';

const Icon = styled('svg')`
  path {
    transition: 0.2s;
    fill: ${p =>
      p.active ? p.theme.colors.textColor : p.theme.colors.grayColor};
    width: ${p => p.width}px;
  }

  g {
    fill: ${p =>
      p.active ? p.theme.colors.textColor : p.theme.colors.grayColor};
  }
`;

export default Icon;
