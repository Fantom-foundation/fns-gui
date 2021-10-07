import React, { useState } from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation, Trans } from 'react-i18next';
import mq from 'mediaQuery';
import EthVal from 'ethval';
import DefaultInput from '../../Forms/Input';
const GWEI = 1000000000;
const COMMIT_GAS_WEI = 42000;
const REGISTER_GAS_WEI = 240000;
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI;

const PriceContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
  margin:5px 0;
`;

const Value = styled('div')`
  margin-top: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid #f4f5fb;
`;

const TotalValue = styled(Value)`
  font-family: Overpass;
  font-style: normal;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: #161b24;
`;

const Description = styled('div')`
  font-family: Overpass;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: #b1bbce;
  margin-top: 10px;
`;

const FTMValue = styled('span')`
  font-weight: 800;
`;

const USD = styled('span')`
  color: #adbbcd;
  margin-left: 20px;
`;

const Input = styled(DefaultInput)`
  display: inline-block;
  width: 4em;
  margin: 5px 0;
`;

const EthRegistrationGasPrice = ({ price, ethUsdPrice, gasPrice }) => {
  const { t } = useTranslation();
  const ethVal = new EthVal(`${price || 0}`).toEth();
  const registerGasSlow = new EthVal(
    `${TOGAL_GAS_WEI * gasPrice.slow}`
  ).toEth();
  const registerGasFast = new EthVal(
    `${TOGAL_GAS_WEI * gasPrice.fast}`
  ).toEth();
  const gasPriceToGweiSlow = new EthVal(`${gasPrice.slow}`).toGwei();
  const gasPriceToGweiFast = new EthVal(`${gasPrice.fast}`).toGwei();
  const totalSlow = ethVal.add(registerGasSlow);
  const totalFast = ethVal.add(registerGasFast);
  let totalInUsdSlow, totalInUsdFast;
  // No price oracle on Goerli
  if (ethUsdPrice) {
    totalInUsdSlow = totalSlow.mul(ethUsdPrice);
    totalInUsdFast = totalFast.mul(ethUsdPrice);
  }
  return (
    <PriceContainer>
      <Description>
        {t('pricer.totalDescription', {
          gasPriceToGweiSlow: gasPriceToGweiSlow.toFixed(0),
          gasPriceToGweiFast: gasPriceToGweiFast.toFixed(0)
        })}
      </Description>
      <TotalValue>
        <FTMValue>{ethVal.toFixed(3)} FTM</FTMValue>
        &nbsp;+ at most <FTMValue>
          {registerGasFast.toFixed(3)} FTM
        </FTMValue>{' '}
        gas fee = at most <FTMValue>{totalFast.toFixed(3)} FTM</FTMValue>
        {ethVal && ethUsdPrice && (
          <USD>
            {' '}
            (${totalInUsdFast.toFixed(2)}
            USD)
          </USD>
        )}
      </TotalValue>
    </PriceContainer>
  );
};

export default EthRegistrationGasPrice;
