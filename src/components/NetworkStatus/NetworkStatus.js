import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';
import mq from 'mediaQuery';
import GlobalState from '../../globalState';
import NoAccountsDefault from '../NoAccounts/NoAccountsModal';
import useNetworkInfo from '../NetworkInformation/useNetworkInfo';
import { connect, disconnect } from '../../api/web3modal';
import ThemeToggler from '../ThemeToggler/ThemeToggler';

const NetworkThemeContainer = styled('div')`
  position: fixed;
  top: 42px;
  right: 40px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const NetworkStatus = styled('div')`
  color: white;
  font-weight: 200;
  text-transform: capitalize;
  display: inline-block;
`;

const BtnConnectWallet = styled('div')`
  margin: auto 0;
  margin-left: 24px;
  width: 168px;
  padding: 18px 38px;
  border-radius: 16px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: 0.2s;
  color: #1969ff;

  background: ${p => p.theme.colors.componentBgColor};

  font-family: SF Pro Text;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;

  /* identical to box height */
  text-align: center;
  letter-spacing: -0.5px;

  cursor: pointer;
`;

const NetworkStatusContainer = () => {
  const { t } = useTranslation();
  const { switchNetwork, currentNetwork } = useContext(GlobalState);
  const handleConnect = async () => {
    let network;
    try {
      network = await connect();
    } catch (e) {
      setError({ variables: { message: e?.message } });
    }
    if (network) {
      switchNetwork(network.chainId);
    }
    location.reload();
  };

  const handleDisconnect = async () => {
    await disconnect();
    switchNetwork(1);
    location.reload();
  };

  const { loading, isReadOnly, isSafeApp } = useNetworkInfo();
  return (
    <NetworkThemeContainer>
      <ThemeToggler />
      <NetworkStatus>
        <BtnConnectWallet
          onClick={isReadOnly ? handleConnect : handleDisconnect}
        >
          {isReadOnly ? t('c.connect') : t('c.disconnect')}
        </BtnConnectWallet>
      </NetworkStatus>
    </NetworkThemeContainer>
  );
};

export default NetworkStatusContainer;
