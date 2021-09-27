import React, { useState, useContext, useEffect } from 'react';
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
import GlobalState from '../globalState';
import SearchDefault from '../components/SearchName/Search';
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal';
import bg from '../assets/heroBG.jpg';
import useNetworkInfo from '../components/NetworkInformation/useNetworkInfo';
import { ExternalButtonLink } from '../components/Forms/Button';
import TextBubbleDefault from '../components/Icons/TextBubble';
import QuestionMarkDefault from '../components/Icons/QuestionMark';
import HowToUseDefault from '../components/HowToUse/HowToUse';
import Alice from '../components/HomePage/Alice';
import ENSLogo from '../components/HomePage/images/ENSLogo.svg';
import { aboutPageURL, hasValidReverseRecord } from '../utils/utils';
import { connect, disconnect } from '../api/web3modal';
import { useBlock } from '../components/hooks';
import { getBlock } from '@ensdomains/ui';
import { emptyAddress } from '../utils/utils';
import DefaultLogo from '../components/Logo';
import moment from 'moment';

const HeroTop = styled('div')`
  display: grid;
  padding: 20px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  grid-template-columns: 1fr;
  ${mq.small`
     grid-template-columns: 1fr 1fr;
  `}
`;

const NoAccounts = styled(NoAccountsDefault)``;

const Network = styled('div')`
  margin-bottom: 5px;
`;
const Name = styled('span')`
  margin-left: 5px;
  text-transform: none;
  display: inline-block;
  width: 100px;
`;

const Warning = styled('div')`
  text-align: center;
  background: red;
  width: 100%;
  color: white;
  padding: 1em;
`;

const NetworkStatus = styled('div')`
  color: white;
  font-weight: 200;
  text-transform: capitalize;
  margin-left: ${mq.small`
    display: block;
  `} ${mq.medium`
    left: 40px;
  `};
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

    color: #161b24;
  }
`;

const NavLink = styled(Link)`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
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
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 1440px;
  margin: auto;
  ${mq.medium`
    padding: 0 20px 0;
  `}
`;

const SearchContainer = styled('div')`
  margin: 0px 220px 0;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  ${mq.medium`
    min-width: 60%;
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
  ${mq.medium`
    min-width: 780px;
  `}

  input {
    width: 100%;
    font-size: 16px;
    background: #ffffff;
    box-shadow: 0px 22.9412px 25px #f2f1fa;
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HomeBanner = styled('h1')`
  margin: 28px 0;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 64px;
  line-height: 76px;
  text-align: center;
  letter-spacing: -0.7px;

  color: #161b24;
`;

const BannerEmphasis = styled('span')`
  color: #1969ff;
`;

export default ({ match }) => {
  const { url } = match;
  const { t } = useTranslation();
  const { switchNetwork, currentNetwork } = useContext(GlobalState);
  const {
    accounts,
    network,
    loading,
    refetch,
    isReadOnly,
    isSafeApp
  } = useNetworkInfo();
  const [graphBlock, setGraphBlock] = useState();
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
  return (
    <>
      {delayInMin >= 0 && (
        <Warning>
          Warning: The data on this stie has only synced to Fantom block{' '}
          {graphBlockNumber} out of {block?.number}( {delayInMin} min delay)
        </Warning>
      )}
      <Hero>
        <HeroTop>
          {!loading && (
            <>
              <Logo />
            </>
          )}
          <NetworkAccountInfoWrapper>
            <Nav>
              {accounts?.length > 0 && (
                <NavLink
                  active={url === '/address/' + accounts[0]}
                  to={'/address/' + accounts[0]}
                >
                  {t('c.mynames')}
                </NavLink>
              )}
              <NavLink to="/favourites">{t('c.favourites')}</NavLink>
              <ExternalLink href={aboutPageURL()}>{t('c.about')}</ExternalLink>
            </Nav>
            {!loading && (
              <>
                <NetworkStatus>
                  {!isSafeApp && (
                    <NoAccounts
                      onClick={isReadOnly ? handleConnect : handleDisconnect}
                      colour="#FFF"
                      textColour="#1969FF"
                      buttonText={
                        isReadOnly ? t('c.connect') : t('c.disconnect')
                      }
                    />
                  )}
                </NetworkStatus>
              </>
            )}
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
      </Hero>
    </>
  );
};
