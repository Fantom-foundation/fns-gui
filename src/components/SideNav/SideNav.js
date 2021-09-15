import React from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';

import NetworkInformation from '../NetworkInformation/NetworkInformation';
import useNetworkInfo from '../NetworkInformation/useNetworkInfo';
import Heart from '../Icons/Heart';
import File from '../Icons/File';
import { aboutPageURL, hasNonAscii } from '../../utils/utils';
import DefaultLogo from '../Logo';
import SpeechBubble from '../Icons/SpeechBubble';

import mq from 'mediaQuery';
import { Link, withRouter } from 'react-router-dom';

const SideNavContainer = styled('nav')`
  display: ${p => (p.isMenuOpen ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  ${mq.medium`
    z-index: 1;
  `}

  left: 0;
  height: auto;
  background: #121d46;
  width: 100%;
  margin-top: -10px;
  ${mq.medium`
    padding: 0;
    top: 35px;
    left: 25px;
    height: 100%;
    background: transparent;
    width: 185px;
    padding: 18px;
    display: block;
    background: #F9FAFB;
    border-radius: 24px;
  `}

  ul {
    padding: 0;
    margin: 0;
    margin-top: 70px;
  }
  li {
    list-style: none;
  }

  ${p =>
    p.hasNonAscii
      ? `
      top: 200px;
      ${mq.medium`top: 200px`}
    `
      : `
      top: 100px;
      ${mq.medium`top: 100px`}
    `}
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#161B24' : '#B1BBCE')};
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  ${mq.medium`
    justify-content: start;
    border-bottom: 0;
  `}

  &:visited {
    color: #161b24;
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    font-family: Overpass;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 25px;
    letter-spacing: -0.5px;

    color: ${p => (p.active ? '#161B24' : '#B1BBCE')};
  }

  &:hover {
    span {
      color: #161b24;
    }
    path {
      fill: #161b24;
    }
    g {
      fill: #161b24;
    }
  }
`;

const ThirdPartyLink = styled('a')`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#161B24' : '#B1BBCE')};
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  ${mq.medium`
    justify-content: start;
    border-bottom: 0;
  `}

  &:visited {
    color: #161b24;
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    font-family: Overpass;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 25px;
    letter-spacing: -0.5px;
    color: ${p => (p.active ? '#161B24' : '#B1BBCE')};
  }

  &:hover {
    span {
      color: #161b24;
    }
    path {
      fill: #161b24;
    }
    g {
      fill: #161b24;
    }
  }
`;

const Logo = styled(DefaultLogo)`
  position: relative;
  display: flex;
  width: 100%;
  padding-left: 0;

  ${mq.medium`
    opacity: 1;
  `}
`;

function SideNav({ match, isMenuOpen, toggleMenu }) {
  const { url } = match;
  const { t } = useTranslation();
  const { accounts } = useNetworkInfo();
  return (
    <SideNavContainer isMenuOpen={isMenuOpen} hasNonAscii={hasNonAscii()}>
      <Logo />
      {/* <NetworkInformation /> */}
      <ul data-testid="sitenav">
        {accounts && accounts.length > 0 ? (
          <li>
            <NavLink
              onClick={toggleMenu}
              active={url === '/address/' + accounts[0]}
              to={'/address/' + accounts[0]}
            >
              <File active={url === '/address/' + accounts[0]} />
              <span>{t('c.mynames')}</span>
            </NavLink>
          </li>
        ) : null}
        <li>
          <NavLink
            onClick={toggleMenu}
            active={url === '/favourites'}
            to="/favourites"
          >
            <Heart active={url === '/favourites'} />
            <span>{t('c.favourites')}</span>
          </NavLink>
        </li>
        <li>
          <ThirdPartyLink href={aboutPageURL()}>
            <SpeechBubble />
            <span>{t('c.about')}</span>
          </ThirdPartyLink>
        </li>
        <li>
          <NavLink onClick={toggleMenu} active={url === '/faq'} to="/faq">
            <SpeechBubble />
            <span>{t('c.faq')}</span>
          </NavLink>
        </li>
      </ul>
    </SideNavContainer>
  );
}
export default withRouter(SideNav);
