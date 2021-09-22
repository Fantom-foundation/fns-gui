import React from 'react';
import styled from '@emotion/styled/macro';

const Heart = ({ active, className }) => (
  <HeartContainer
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    active={active}
    className={className}
  >
    <path
      d="M15.25 4.86002C15.25 5.94208 14.7843 6.91019 14.0018 7.70005L8.00081 13.5845L1.99999 7.61961C1.22706 6.84009 0.75 5.79179 0.75 4.69554C0.75 3.70574 1.20685 2.73991 1.99025 1.9458C2.8622 1.14507 3.89016 0.690681 4.93246 0.75631L4.956 0.757792H4.97959C5.84005 0.757792 6.65812 1.09028 7.36609 1.66088L7.83428 2.03822L8.30439 1.66327C9.96026 0.342603 12.3052 0.475186 13.8351 2.01649L13.8694 2.05109L13.9079 2.08095C14.7777 2.75497 15.25 3.76551 15.25 4.86002Z"
      fill="#FF395D"
      stroke="#FF395D"
      stroke-width="1.5"
    />
  </HeartContainer>
);

const HeartContainer = styled('svg')`
  vertical-align: middle;
  path {
    fill: #ff395d;
    stroke: #ff395d;
    transition: 0.2s ease-out;
  }

  &:hover {
    path {
      fill: none;
      stroke: #ff395d;
    }
  }
`;

export default Heart;
