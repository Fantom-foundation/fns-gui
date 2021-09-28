import styled from '@emotion/styled/macro';

const Icon = styled('svg')`
  path {
    transition: 0.2s;
    fill: ${p => (p.color ? p.color : p.active ? '#161B24' : '#B1BBCE')};
    width: ${p => p.width}px;
  }

  g {
    fill: ${p => (p.color ? p.color : p.active ? '#161B24' : '#B1BBCE')};
  }
`;

export default Icon;
