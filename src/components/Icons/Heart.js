import React from 'react';
import styled from '@emotion/styled/macro';
import Icon from './IconBase';

const SVG = styled(Icon)``;

const Heart = ({ active, className }) => (
  <SVG
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill={active ? '#161B24' : '#B1BBCE'}
    active={active}
    className={className}
  >
    <path d="M16 4.86002C16 6.17588 15.4286 7.32726 14.5306 8.23191L8.40816 14.2355C8.2449 14.3178 8.16327 14.4 8 14.4C7.83674 14.4 7.67347 14.3178 7.59184 14.2355L1.46939 8.14967C0.571429 7.24502 0 6.0114 0 4.69554C0 3.46192 0.571429 2.31055 1.46939 1.40589C2.44898 0.501239 3.67347 -0.0744488 4.97959 0.00779237C6.04082 0.00779237 7.02041 0.418998 7.83674 1.07693C9.79592 -0.485655 12.5714 -0.321172 14.3673 1.48813C15.4286 2.31055 16 3.54416 16 4.86002Z" />
  </SVG>
);

export default Heart;
