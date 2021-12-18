import React, { useState, useContext, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  GET_REVERSE_RECORD,
  GET_META_BLOCK_NUMBER_FROM_GRAPH
} from 'graphql/queries';
import { SET_ERROR } from 'graphql/mutations';
import mq from 'mediaQuery';
import SearchDefault from '../components/SearchName/Search';
import bg from '../assets/heroBG.jpg';
import useNetworkInfo from '../components/NetworkInformation/useNetworkInfo';
import { ExternalButtonLink } from '../components/Forms/Button';
import TextBubbleDefault from '../components/Icons/TextBubble';
import QuestionMarkDefault from '../components/Icons/QuestionMark';
import HowToUseDefault from '../components/HowToUse/HowToUse';
import Alice from '../components/HomePage/Alice';
import FNSLogo from '../components/HomePage/images/FNSLogo.svg';
import SocialContainer from '../components/Social/Social';
import Web3Logo from '../components/HomePage/images/web3.svg';
import WalletsLogo from '../components/HomePage/images/wallets.svg';
import WebsitesLogo from '../components/HomePage/images/websites.svg';
import { aboutPageURL, hasValidReverseRecord } from '../utils/utils';
import { useBlock } from '../components/hooks';
import { getBlock } from '@ensdomains/ui';
import { emptyAddress } from '../utils/utils';
import DefaultLogo from '../components/Logo';
import moment from 'moment';
import background from '../components/HomePage/images/background.png';

const HomePageContainer = styled('div')`
  background: url(${background});
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: 100%;
`;

const HeroTop = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  background: ${p => (p.active ? 'rgba(5, 6, 7, 0.95)' : 'transparent')};
  ${mq.small`
     grid-template-columns: 1fr 1fr;
  `}
`;

const HeroBottom = styled('div')`
  border-top: 1px solid #232a31;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #050607;
  z-index: 1;
`;

const Warning = styled('div')`
  text-align: center;
  background: red;
  width: 100%;
  color: white;
  padding: 1em;
`;

const Nav = styled('div')`
  display: flex;
  justify-content: center;
  ${mq.small`
    justify-content: flex-end;
  `}
  a {
    margin-right: 45px;
    font-family: 'SF Pro Text';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.5px;

    color: ${p => p.theme.colors.textColor};
  }
`;

const NavLink = styled(Link)`
  padding: 18px 38px;
  background: #ffffff;
  box-shadow: 0px 22.9412px 91.7647px rgba(216, 221, 255, 0.28);
  border-radius: 16px;
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  letter-spacing: -0.5px;

  color: #0d131d !important;
`;

const ExternalLink = styled('a')`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`;

const Announcement = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #5284ff;
  padding: 0 10px;
  border-bottom: #5284ff solid 3px;
  h3 {
    color: white;
    font-weight: 400;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: white;
  }
  a {
    color: white;
    text-decoration: none;
  }
`;

const HowToUse = styled(HowToUseDefault)`
  padding: 70px;
`;

const Hero = styled('section')`
  flex-direction: column;
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1440px;
  margin: auto;
  ${mq.medium`
    padding: 0 20px 0;
  `}
`;

const Description = styled('section')`
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1440px;
  margin: auto;
  ${mq.medium`
  padding: 0 20px 0;
`}
`;

const DescriptionWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  margin-bottom: 200px;
  flex-wrap: wrap;
  ${mq.medium`
    flex-direction: row;
  `}
  ${mq.xLarge`
    padding: 0 70px;
  `}
`;

const DescriptionItemWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 32px;
  background: #060708;
  border: 1px solid #232a31;
  box-sizing: border-box;
  backdrop-filter: blur(16px);

  /* Note: backdrop-filter has minimal browser support */
  border-radius: 18px;
  margin: 8px;
  max-width: 281px;
  ${mq.medium`
    max-width: 400px;
  `}
`;

const SearchContainer = styled('div')`
  margin: 220px 0;
  display: flex;
  flex-direction: column;
  max-width: 80%;
  ${mq.medium`
    max-width: 90%;
  `}
  > h2 {
    color: white;
    font-size: 38px;
    font-weight: 100;
    margin-bottom: 10px;
  }

  > h3 {
    color: white;
    font-weight: 100;
    font-size: 24px;
    margin-top: 0;
  }
`;

const Search = styled(SearchDefault)`
  min-width: 90%;
  margin: 0 30px;

  input {
    width: 100%;
    font-size: 16px;
    background: transparent;
    border-radius: 16px;
  }
`;

const Explanation = styled('div')`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr;
  grid-template-rows: auto;
  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  `}
  grid-gap: 0;
`;

const H2 = styled('h2')`
  font-size: 30px;
  font-weight: 500;
`;

const Section = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WhatItIs = styled(Section)`
  padding: 40px 20px 80px;
  p {
    font-size: 18px;
  }
`;

const HowItWorks = styled(Section)`
  background: #f0f6fa;
  padding: 40px 20px 80px;
`;

const Inner = styled('div')`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;

  > p {
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 1.5em;
  }
`;
const NameAnimation = styled(Section)`
  display: block;
  height: 100%;
`;

const TextBubble = styled(TextBubbleDefault)`
  margin-right: 10px;
`;

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`;

const LogoLarge = styled(motion.img)`
  width: 50%;
  margin: 0 auto 0;
  ${mq.medium`
    width: 223px;
  `}
`;

const DescriptionIcon = styled('img')``;

const DescriptionIconWrapper = styled('div')``;

const DescriptionTitle = styled('label')`
  margin-top: 20px;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */

  color: #ffffff;
`;

const DescriptionContent = styled('p')`
  font-family: Overpass;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: #5b6876;
`;

const PermanentRegistrarLogo = styled(motion.h1)`
  font-family: Overpass;
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  color: #4258d3;
  letter-spacing: 1.8px;
  text-align: right;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
`;

const ReadOnly = styled('span')`
  margin-left: 1em;
`;

const Logo = styled(DefaultLogo)`
  position: relative;
  display: flex;
  width: 100%;

  ${mq.medium`
    opacity: 1;
  `}
`;

const NetworkAccountInfoWrapper = styled('div')`
  flex: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HomeBanner = styled('h1')`
  margin: 28px 0;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 80px;
  text-align: center;
  letter-spacing: -0.7px;

  color: ${p => p.theme.colors.textColor};
`;

const BannerEmphasis = styled('span')`
  color: #1969ff;
`;

export default ({ match }) => {
  const {
    accounts,
    network,
    loading,
    refetch,
    isReadOnly,
    isSafeApp
  } = useNetworkInfo();
  const [graphBlock, setGraphBlock] = useState();

  const [goingUp, setGoingUp] = useState(false);

  const address = accounts && accounts[0];
  const { data: metaBlock } = useQuery(GET_META_BLOCK_NUMBER_FROM_GRAPH);
  const graphBlockNumber = metaBlock?._meta?.block?.number;

  const { block } = useBlock();

  let subGraphLatency, delayInMin;
  if (block && graphBlock) {
    moment
      .unix(block.timestamp)
      .diff(moment.unix(graphBlock.timestamp), 'minutes');
  }

  useEffect(() => {
    if (graphBlockNumber) {
      getBlock(graphBlockNumber).then(b => {
        setGraphBlock(b);
      });
    }
  }, [graphBlockNumber]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY == 0) {
        setGoingUp(false);
      } else {
        setGoingUp(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [goingUp]);

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address
    }
  });
  const displayName = hasValidReverseRecord(getReverseRecord)
    ? getReverseRecord.name
    : address && `${address.slice(0, 10)}...`;

  const animation = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      opacity: 1,
      scale: 1
    }
  };

  const [setError] = useMutation(SET_ERROR);

  return (
    <HomePageContainer>
      {delayInMin >= 0 && (
        <Warning>
          Warning: The data on this stie has only synced to Fantom block{' '}
          {graphBlockNumber} out of {block?.number}( {delayInMin} min delay)
        </Warning>
      )}
      <Hero>
        <HeroTop active={goingUp}>
          {!loading && (
            <>
              <Logo />
            </>
          )}
          <NetworkAccountInfoWrapper>
            <NavLink to="/dashboard">Launch App</NavLink>
          </NetworkAccountInfoWrapper>
        </HeroTop>
        <SearchContainer>
          <>
            <HomeBanner>
              Discover the <BannerEmphasis>domain for you</BannerEmphasis> with
              Fantom Name Service.
            </HomeBanner>
            <Search />
          </>
        </SearchContainer>
        <DescriptionWrapper>
          <DescriptionItemWrapper>
            <DescriptionIconWrapper>
              <DescriptionIcon src={Web3Logo} />
            </DescriptionIconWrapper>
            <DescriptionTitle>Personalized Web3 usernames</DescriptionTitle>
            <DescriptionContent>
              Own a personalized, portable username usable across Web3. Link an
              avatar and add profile information that goes where you do.
            </DescriptionContent>
          </DescriptionItemWrapper>
          <DescriptionItemWrapper>
            <DescriptionIconWrapper>
              <DescriptionIcon src={WalletsLogo} />
            </DescriptionIconWrapper>
            <DescriptionTitle>
              Usernames replace wallet addresses
            </DescriptionTitle>
            <DescriptionContent>
              Link crypto wallet addresses to your username and receive
              cryptocurrency, NFTs, and more. Never worry again about
              copy-pasting long addresses.
            </DescriptionContent>
          </DescriptionItemWrapper>
          <DescriptionItemWrapper>
            <DescriptionIconWrapper>
              <DescriptionIcon src={WebsitesLogo} />
            </DescriptionIconWrapper>
            <DescriptionTitle>Decentralized Websites</DescriptionTitle>
            <DescriptionContent>
              Make your website decentralized and censorship-proof. Upload your
              website to the IPFS and link your FNS username to establish your
              web presence.{' '}
            </DescriptionContent>
          </DescriptionItemWrapper>
        </DescriptionWrapper>
        <HeroBottom>
          <Logo />
          <SocialContainer />
        </HeroBottom>
      </Hero>
    </HomePageContainer>
  );
};
