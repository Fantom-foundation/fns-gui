import styled from '@emotion/styled/macro';
import mq from 'mediaQuery';

export const H2 = styled('h2')`
  font-size: 18px;
  font-weight: 200;
  color: #adbbcd;

  ${mq.medium`
    font-size: 22px;
  `}
`;

export const Title = styled('h2')`
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: #161b24;
  padding: 0;
  margin: 0;
`;

export const HR = styled('hr')`
  border: 0;
  border-top: 1px dashed #d3d3d3;
  background-color: #fff;
  margin-bottom: 30px;
  margin-top: 0;
`;
