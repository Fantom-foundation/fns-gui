import React from 'react';
import styled from '@emotion/styled/macro';

import github from '../Icons/Github.svg';
import twitter from '../Icons/Twitter.svg';
import discord from '../Icons/Discord.svg';
import telegram from '../Icons/Telegram.svg';

import mq from 'mediaQuery';
import { withRouter } from 'react-router-dom';

const SocialContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ExternalLink = styled('a')`
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#1969ff' : '#B1BBCE')};
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  ${mq.medium`
    justify-content: start;
    border-bottom: 0;
  `}

  &:visited {
    color: #1969ff;
  }

  svg,
  svg path {
    fill: ${p => (p.active ? '#1969ff' : '#B1BBCE')};
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    font-family: Overpass;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 1;
    padding-top: 2px;
    letter-spacing: -0.5px;

    color: ${p => (p.active ? '#1969ff' : '#B1BBCE')};
  }

  &:hover {
    span {
      color: #1969ff;
    }
    path {
      fill: #1969ff;
    }
    g {
      fill: #1969ff;
    }
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const social = [
  {
    img: discord,
    text: 'Discord',
    link: 'http://chat.fantom.network/'
  },
  {
    img: twitter,
    text: 'Twitter',
    link: 'https://twitter.com/FantomFDN'
  },
  {
    img: telegram,
    text: 'Telegram',
    link: 'https://t.me/Fantom_English'
  },
  {
    img: github,
    text: 'Github',
    link: 'https://github.com/Fantom-Foundation'
  }
];

function SideNav() {
  return (
    <SocialContainer>
      {social.map(s => (
        <ExternalLink href={s.link}>
          <img src={s.img} />
        </ExternalLink>
      ))}
    </SocialContainer>
  );
}
export default withRouter(SideNav);
