import React from 'react';
import styled from '@emotion/styled/macro';

export const Tab = styled('div')`
  font-size: 14px;
  background: ${({ active }) => (active ? '#1969FF' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#B1BBCE')};
  transform: scale(${({ active }) => (active ? '1.02' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  border-radius: 16px;
  &:hover,
  &:visited {
    cursor: pointer;
    color: ${({ active }) => (active ? 'white' : '#B1BBCE')};
  }
`;

export const TabsContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  background: white;
  border-radius: 16px;
`;

export const Tabs = props => {
  return (
    <div>
      <TabsContainer>{props.children}</TabsContainer>
    </div>
  );
};
