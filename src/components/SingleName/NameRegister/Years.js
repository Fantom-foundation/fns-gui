import React from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';
import mq from 'mediaQuery';

const YearsContainer = styled('div')``;

const Stepper = styled('div')`
  display: grid;
  grid-template-columns:
    30px auto
    30px;
  background: #f9fafb;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 15px;

  &.error {
    border: 1px solid #ff395d;
  }
`;

const Icon = styled('div')`
  font-family: Overpass;
  font-size: 20px;
  font-weight: 100;
  color: white;
  ${p => p.emphasize && 'background-color: #1969FF;'}
  ${p =>
    p.emphasize
      ? 'border-color: white;'
      : 'color: #adbbcd;'}
  
  border-radius: 50%;
  border: solid 1px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  transition: 0.2s;

  &:hover {
    color: #2500a6;
    cursor: pointer;
  }
`;

const Amount = styled('div')`
  width: 150px;
  padding-left: 20px;
  display: flex;
  justify-self: left;
  align-self: center;

  font-family: Overpass;
  font-style: normal;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.5px;

  color: #161b24;

  input {
    background: transparent;
    border: none;
    max-width: 45px;
    outline: 0;
    font-weight: 800;
    font-size: 18px;
    line-height: 28px;
  }
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

const Years = ({ years, setYears }) => {
  const { t } = useTranslation();
  const incrementYears = () => setYears(years + 1);
  const decrementYears = () => (years >= 1 ? setYears(years - 1) : null);
  const currentLanguage = window.localStorage.getItem('language');
  return (
    <YearsContainer>
      <Description>{t('pricer.registrationPeriodLabel')}</Description>
      <Stepper>
        <Icon onClick={decrementYears}>-</Icon>
        <Amount>
          <input
            type="text"
            value={years}
            onChange={e => {
              const sign = Math.sign(e.target.value);
              if (sign === -1 || isNaN(sign)) {
                setYears(0);
              } else {
                setYears(e.target.value);
              }
            }}
          />{' '}
          {t('pricer.yearUnit')}
          {currentLanguage === 'en' && years > 1 && 's'}
        </Amount>
        <Icon onClick={incrementYears} emphasize={years < 2}>
          +
        </Icon>
      </Stepper>
    </YearsContainer>
  );
};

export default Years;
