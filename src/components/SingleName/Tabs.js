import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';

import mq from 'mediaQuery';

const TabLink = styled(Link)`
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  letter-spacing: -0.5px;
  border-radius: 16px;
  background: ${({ active }) => (active ? '#1969FF' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#B1BBCE')};
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  ${mq.small`
    padding: 10px 50px;
  `}
  &:hover,
  &:visited {
    color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  }
`;

const TabContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  margin-left: 20px;
  margin-top: 20px;
  border-radius: 16px;

  ${mq.small`
    margin-right: 0;
    margin: 0;
    margin-left: 20px;
  `}
`;
function getDetailsActive(domain, pathname, tab) {
  const { name } = domain;
  if (domain.parent !== 'ftm') {
    return (
      pathname !== `/name/${name}/register` &&
      pathname !== `/name/${name}/subdomains`
    );
  } else {
    return (
      (tab === 'details' || pathname === `/name/${name}/details`) &&
      (pathname !== `/name/${name}/register` &&
        pathname !== `/name/${name}/subdomains`)
    );
  }
}
const Tabs = ({ domain, pathname, parent, tab }) => {
  const { t } = useTranslation();
  const { name, state } = domain;
  return (
    (state !== 'Auction' || state !== 'Reveal') && (
      <TabContainer>
        {parent === 'ftm' && (
          <TabLink
            active={
              (tab === 'register' || pathname === `/name/${name}/register`) &&
              (pathname !== `/name/${name}/details` &&
                pathname !== `/name/${name}/subdomains`)
            }
            to={`/name/${name}/register`}
          >
            {t('singleName.tabs.register')}
          </TabLink>
        )}

        <TabLink
          active={getDetailsActive(domain, pathname, tab)}
          to={`/name/${name}/details`}
        >
          {t('singleName.tabs.details')}
        </TabLink>
        <TabLink
          active={pathname === `/name/${name}/subdomains`}
          to={`/name/${name}/subdomains`}
        >
          {t('singleName.tabs.subdomains')}
        </TabLink>
      </TabContainer>
    )
  );
};
export default Tabs;
