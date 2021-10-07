import React from 'react';
import styled from '@emotion/styled/macro';
import Years from './NameRegister/Years';
import Price from './NameRegister/Price';
import EthRegistrationGasPrice from './NameRegister/EthRegistrationGasPrice';
import { ReactComponent as DefaultRedExclamation } from '../Icons/RedExclamation.svg';
import mq from 'mediaQuery';
import ReverseArrows from '../Icons/ReverseArrows';
import { useTranslation } from 'react-i18next';

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  ${mq.medium`
    grid-template-columns:
      minmax(min-content, 200px) minmax(min-content, min-content)
      minmax(200px, 1fr);
  `}
`;

const RedExclamation = styled(DefaultRedExclamation)`
  height: 12px;
  width: 12px;
  margin-right: 9px;
`;

const Prompt = styled('div')`
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.5px;

  color: #ff395d;
  background: rgba(255, 57, 93, 0.04);
  margin-bottom: 10px;
  padding: 9px 9px 9px 50px;
  border-left: 2px solid #ff395d;

  display: flex;
  align-items: center;
`;

function PricerInner({
  years,
  setYears,
  duration,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  className,
  loading,
  price,
  gasPrice,
  reference,
  underPremium,
  displayGas = false
}) {
  const { t } = useTranslation();
  return (
    <>
      {years <= 1 && (
        <Prompt>
          <RedExclamation />
          {t('register.increaseRegistrationPeriod')}
        </Prompt>
      )}
      <PricingContainer className={className} ref={reference}>
        <Years years={years} setYears={setYears} />
        <ReverseArrows />
        <Price
          price={price}
          gasPrice={gasPrice}
          loading={loading}
          ethUsdPriceLoading={ethUsdPriceLoading}
          ethUsdPrice={ethUsdPrice}
          ethUsdPremiumPrice={ethUsdPremiumPrice}
          underPremium={underPremium}
        />
      </PricingContainer>
      {displayGas && gasPrice && (
        <div>
          <EthRegistrationGasPrice
            price={price}
            gasPrice={gasPrice}
            loading={loading}
            ethUsdPriceLoading={ethUsdPriceLoading}
            ethUsdPrice={ethUsdPrice}
            ethUsdPremiumPrice={ethUsdPremiumPrice}
            underPremium={underPremium}
          />
        </div>
      )}
    </>
  );
}

export const PricerAll = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />;
});

const Pricer = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />;
});

export default Pricer;
