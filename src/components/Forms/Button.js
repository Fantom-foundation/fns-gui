import React from 'react';
import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';

function getButtonStyles({ type }) {
  switch (type) {
    case 'primary':
      return `
        &:visited {
          color: white;
        }
        &:hover {
          cursor: pointer;
          border: 2px solid #2c46a6;
          background: #2c46a6;
        }
      `;
    case 'hollow':
      return `
        color: #DFDFDF;
        &:hover {
          cursor: pointer;
          border: 2px solid transparent;
          background: #2c46a6;
        }
      `;
    case 'hollow-white':
      return `
        background: transparent;
        color: white;
        border: 2px solid #fff;
        &:visited {
          color: white;
        }
        &:hover {
          color: white;
          cursor: pointer;
          border: 2px solid transparent;
          background: #2c46a6;
        }
      `;
    case 'hollow-primary':
      return `
        color: #5384FE;
        background: transparent;
        border: 2px solid #5384FE;
        &:visited {
          color: #5384FE;
        }
        &:hover {
          cursor: pointer;
          border: 2px solid #2C46A6;
          color: #2C46A6;
        }
      `;
    case 'hollow-primary-disabled':
      return `
      color: ${p => p.theme.colors.textColor};
        background: #1969ff;
        opacity: 0.6;
        &:visited {
          color: ${p => p.theme.colors.textColor};
        }
        &:hover {
          color: ${p => p.theme.colors.textColor};
          cursor: default
        }
      `;
    case 'disabled':
      return `
        background: #1969ff;
        opacity: 0.6;
        &:hover {
          cursor: default
        }
        
      `;
    default:
      return '';
  }
}

function getButtonDefaultStyles(p) {
  return `
    color: white;
    background: #1969FF;
    padding: 10px 25px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 700;
    font-family: Overpass;
    text-transform: capitalize;
    letter-spacing: 1.5px;
    transition: 0.2s all;
    border: 2px solid #5384FE;
    text-align: center;

    &:disabled {
      background: #B1BBCE;
    }

    &:focus {
      outline: 0;
    }
  `;
}

const ButtonContainer = styled('button')`
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`;

const ExternalButtonLinkContainer = styled('a')`
  text-decoration: none;
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`;

const ButtonLinkContainer = styled(Link)`
  color: white;
  &:hover {
    color: white;
  }
  &:visited {
    color: white;
  }
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`;

const Button = props => {
  const { className, children, type = 'primary', onClick } = props;
  return (
    <ButtonContainer
      className={className}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </ButtonContainer>
  );
};

export const ButtonLink = props => {
  const { className, children, type = 'primary', to = '' } = props;
  return (
    <ButtonLinkContainer className={className} to={to} type={type} {...props}>
      {children}
    </ButtonLinkContainer>
  );
};

export const ExternalButtonLink = props => {
  const { className, children, type = 'primary', href } = props;
  return (
    <ExternalButtonLinkContainer
      className={className}
      href={href}
      type={type}
      {...props}
    >
      {children}
    </ExternalButtonLinkContainer>
  );
};

export default Button;

export { getButtonDefaultStyles, getButtonStyles };
