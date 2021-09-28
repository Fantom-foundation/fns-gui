import React from 'react';
import styled from '@emotion/styled/macro';

const NoAccountsContainer = styled('div')`
  box-shadow: ${({ active }) =>
    active ? '0px 22.9412px 91.7647px #ECECF5' : 'none'};
  padding: 17px 40px;
  border-radius: 16px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${({ active }) => (active ? '150px' : '150px')};
  transition: 0.2s;

  span {
    color: ${({ textColour }) => textColour};
    font-family: SF Pro Text;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;

    /* identical to box height */
    text-align: center;
    letter-spacing: -0.5px;
  }

  &:hover {
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
  }
`;

const SVG = styled('svg')`
  margin-right: 10px;
`;

const NoAccounts = ({
  className,
  colour = '#ffffff',
  textColour,
  onClick,
  buttonText,
  active
}) => (
  <NoAccountsContainer
    colour={colour}
    className={className}
    onClick={onClick}
    active={active}
    textColour={textColour}
  >
    <span>{buttonText}</span>
  </NoAccountsContainer>
);

export default NoAccounts;
