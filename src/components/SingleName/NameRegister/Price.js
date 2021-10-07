import React from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';
import mq from 'mediaQuery';
import EthVal from 'ethval';
import { InlineLoader } from 'components/Loader';

const PriceContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
`;

const Value = styled('div')`
  background: #f9fafb;
  border-radius: 12px;

  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.5px;

  padding: 15px;
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
  margin-bottom: 9px;
`;

const USD = styled('span')`
  margin-left: 20px;
  color: #b1bbce;
`;

const Price = ({
  loading,
  price,
  ethUsdPrice,
  ethUsdPremiumPrice,
  ethUsdPriceLoading,
  initialGasPrice,
  underPremium
}) => {
  const { t } = useTranslation();

  let ethPrice = <InlineLoader />;
  let ethVal, basePrice, withPremium, usdPremium;

  if (!loading && price) {
    ethVal = new EthVal(`${price}`).toEth();
    ethPrice = ethVal && ethVal.toFixed(3);

    if (ethUsdPrice && ethUsdPremiumPrice) {
      basePrice = ethVal.mul(ethUsdPrice) - ethUsdPremiumPrice;

      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${basePrice.toFixed(0)}(+$${ethUsdPremiumPrice.toFixed(2)}) =`
          : null;

      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2);
    } else if (ethUsdPrice) {
      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2);
    }
  }

  return (
    <PriceContainer>
      <Description>
        {ethUsdPremiumPrice
          ? t('pricer.pricePerAmount')
          : t('pricer.registrationPriceLabel')}
      </Description>
      <Value>
        {ethPrice} FTM
        {ethVal && ethUsdPrice && <USD>({usdPremium} USD)</USD>}
      </Value>
    </PriceContainer>
  );
};

export default Price;
