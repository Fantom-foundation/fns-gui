import React from 'react';
import styled from '@emotion/styled/macro';
import Icon from './IconBase';

const SVG = styled(Icon)``;

const Window = ({ active, className }) => (
  <SVG
    width="13"
    height="16"
    viewBox="0 0 13 16"
    active={active}
    className={className}
  >
    <path d="M6.39997 7.8367C8.57511 7.8367 10.3384 6.08239 10.3384 3.91835C10.3384 1.7543 8.57511 0 6.39997 0C4.22483 0 2.46153 1.7543 2.46153 3.91835C2.46153 6.08239 4.22483 7.8367 6.39997 7.8367Z" />
    <path d="M8.45124 9.46942H4.3487C1.96922 9.46942 0 11.4286 0 13.7959C0 14.3674 0.246153 14.8572 0.738458 15.102C1.47692 15.5102 3.11793 16 6.39997 16C9.682 16 11.323 15.5102 12.0615 15.102C12.4717 14.8572 12.7999 14.3674 12.7999 13.7959C12.7999 11.347 10.8307 9.46942 8.45124 9.46942Z" />
  </SVG>
);

export default Window;
