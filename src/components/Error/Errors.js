import React from 'react';
import styled from '@emotion/styled/macro';

import warningImage from '../../assets/warning.svg';

const ErrorContainer = styled('div')`
  color: black;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto 0;
`;

const Warning = styled('img')`
  width: 40px;
`;

const H2 = styled('h2')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 28px;
  color: ${p => p.theme.colors.grayColor};
  text-align: center;
`;

const Message = styled('div')`
  color: ${p => p.theme.colors.textColor};
`;

export const NetworkError = ({ message }) => (
  <ErrorContainer>
    <Message>
      <Warning src={warningImage} />
      <H2>{message}</H2>
      <br />
      Please change your dapp browser to Fantom Opera Mainnet or Testnet
    </Message>
  </ErrorContainer>
);

export const Error404 = () => (
  <ErrorContainer>
    <Message>
      <Warning src={warningImage} />
      <H2>404</H2>
      We couldn't find what you were looking for!
    </Message>
  </ErrorContainer>
);
