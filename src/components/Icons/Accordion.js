import React from 'react';
import styled from '@emotion/styled/macro';
import Icon from './IconBase';

const SVG = styled('svg')`
  path {
    width: 50px;
  }
`;

const Accordion = ({ expand }) =>
  expand ? (
    <SVG width="18" height="18">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        fill="#161B24"
        stroke="#161B24"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 5.7998V12.1998"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.79999 9H12.2"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SVG>
  ) : (
    <SVG width="18" height="18">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        fill="#1969FF"
        stroke="#1969FF"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.79999 9H12.2"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SVG>
  );

export default Accordion;
