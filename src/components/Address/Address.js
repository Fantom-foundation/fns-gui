import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from 'react-apollo';
import { useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import moment from 'moment';
import { useAccount } from '../QueryAccount';
import PageTitle from '../Layout/PageTitle';
import SearchDefault from '../SearchName/Search';

import {
  GET_FAVOURITES,
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH
} from '../../graphql/queries';
import { decryptName, checkIsDecrypted } from '../../api/labels';

import mq from 'mediaQuery';

import AddressContainer from '../Basic/MainContainer';
import DefaultTopBar from '../Basic/TopBar';
import { Title as DefaultTitle } from '../Typography/Basic';
import DefaultFtmScanLink from '../Links/FtmScanLink';
import { getEtherScanAddr, filterNormalised } from '../../utils/utils';
import { calculateIsExpiredSoon } from '../../utils/dates';
import DomainList from './DomainList';
import RenewAll from './RenewAll';
import Sorting from './Sorting';
import Filtering from './Filtering';
import Loader from '../Loader';
import Banner from '../Banner';
import Checkbox from '../Forms/Checkbox';
import { SingleNameBlockies } from '../Blockies';
import Pager from './Pager';
import AddReverseRecord from '../AddReverseRecord';

import warning from '../../assets/yellowwarning.svg';
import close from '../../assets/close.svg';
import { useBlock } from '../hooks';

const DEFAULT_RESULTS_PER_PAGE = 25;

const TopBar = styled(DefaultTopBar)`
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const Title = styled(DefaultTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FtmScanLink = styled(DefaultFtmScanLink)`
  min-width: 150px;
  margin-left: auto;
`;

const Close = styled('img')`
  position: absolute;
  right: 20px;
  top: 20px;
  &:hover {
    cursor: pointer;
  }
`;

const Controls = styled('div')`
  background: ${p => p.theme.colors.componentBgColor};
  padding: 30px;
  border-radius: 16px;
  display: grid;
  align-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'filters'
    'actions'
    'renew'
    'sorting'
    'selectall';
  grid-gap: 20px 10px;
  margin: 20px;

  ${mq.large`
    margin: 20px 0px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'filters actions'
    'renew renew'
    'sorting selectall'
    ;
  `}
`;

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;

  ${mq.large`
    padding-right: 10px;
  `}
`;

const Search = styled(SearchDefault)`
  min-width: 90%;
  margin: 0;
  margin-bottom: 40px;
  ${mq.medium`
    min-width: 780px;
  `}

  input {
    width: 100%;
    font-size: 16px;
    border-radius: 16px;
  }
`;

function filterOutReverse(domains) {
  return domains.filter(domain => domain.parent);
}

function normaliseAddress(address) {
  return address.toLowerCase();
}

function decryptNames(domains) {
  return domains.map(d => {
    const name = decryptName(d.domain.name);
    return {
      ...d,
      domain: {
        ...d.domain,
        name: name,
        labelName: checkIsDecrypted(name[0]) ? name.split('.')[0] : null
      }
    };
  });
}

function useDomains({
  resultsPerPage,
  domainType,
  address,
  sort,
  page,
  expiryDate
}) {
  const skip = (page - 1) * resultsPerPage;
  const registrationsQuery = useQuery(GET_REGISTRATIONS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip,
      orderBy: sort.type,
      orderDirection: sort.direction,
      expiryDate
    },
    skip: domainType !== 'registrant'
  });

  const controllersQuery = useQuery(GET_DOMAINS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip
    },
    skip: domainType !== 'controller'
  });

  if (domainType === 'registrant') {
    return registrationsQuery;
  } else if (domainType === 'controller') {
    return controllersQuery;
  } else {
    throw new Error('Unrecognised domainType');
  }
}

export default function Address({
  url,
  address,
  showOriginBanner,
  domainType = 'registrant'
}) {
  const normalisedAddress = normaliseAddress(address);
  const { search } = useLocation();
  const account = useAccount();
  const pageQuery = new URLSearchParams(search).get('page');
  const page = pageQuery ? parseInt(pageQuery) : 1;
  const { block } = useBlock();
  let [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE);
  let { t } = useTranslation();
  let [showOriginBannerFlag, setShowOriginBannerFlag] = useState(true);
  let [etherScanAddr, setEtherScanAddr] = useState(null);
  let [activeSort, setActiveSort] = useState({
    type: 'expiryDate',
    direction: 'asc'
  });
  let [checkedBoxes, setCheckedBoxes] = useState({});
  let [years, setYears] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  let currentDate, expiryDate;
  if (process.env.REACT_APP_STAGE === 'local') {
    if (block) {
      currentDate = moment(block.timestamp * 1000);
    }
  } else {
    currentDate = moment();
  }
  if (currentDate) {
    expiryDate = currentDate.subtract(90, 'days').unix();
  }

  const { loading, data, error, refetch } = useDomains({
    resultsPerPage,
    domainType,
    address: normalisedAddress,
    sort: activeSort,
    page,
    expiryDate
  });

  const { data: { favourites } = [] } = useQuery(GET_FAVOURITES);
  useEffect(() => {
    getEtherScanAddr().then(setEtherScanAddr);
  }, []);
  if (error) {
    console.log(error);
    return <>Error getting domains. {JSON.stringify(error)}</>;
  }

  if (loading) {
    return <Loader withWrap large />;
  }

  let normalisedDomains = [];

  if (domainType === 'registrant' && data.account) {
    normalisedDomains = [...data.account.registrations];
  } else if (domainType === 'controller' && data.account) {
    normalisedDomains = [
      ...filterOutReverse(data.account.domains).map(domain => ({ domain }))
    ];
  }

  let decryptedDomains = filterNormalised(
    decryptNames(normalisedDomains),
    'labelName',
    true
  );
  // let sortedDomains = decryptedDomains.sort(getSortFunc(activeSort))
  let domains = decryptedDomains;
  const selectedNames = Object.entries(checkedBoxes)
    .filter(([key, value]) => value)
    .map(([key]) => key);

  const allNames = domains
    .filter(d => d.domain.labelName)
    .map(d => d.domain.name);

  const selectAllNames = () => {
    const obj = allNames.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});

    setCheckedBoxes(obj);
  };

  const hasNamesExpiringSoon = !!domains.find(domain =>
    calculateIsExpiredSoon(domain.expiryDate)
  );

  return (
    <>
      <PageTitle>My Account</PageTitle>
      <Search />
      {showOriginBanner && showOriginBannerFlag && (
        <Banner>
          <Close onClick={() => setShowOriginBannerFlag(false)} src={close} />
          {t('address.transactionBanner')}
        </Banner>
      )}
      {hasNamesExpiringSoon && (
        <Banner>
          <h3>
            <img alt="exclamation mark" src={warning} />
            &nbsp; {t('address.namesExpiringSoonBanner.title')}
            <p>
              <Trans i18nKey="address.namesExpiringSoonBanner.text">
                One or more names are expiring soon, renew them all in one
                transaction by selecting multiple names and click "Renew"
              </Trans>
            </p>
          </h3>
        </Banner>
      )}

      <AddressContainer>
        <TopBar>
          <Title>{address}</Title>
          {etherScanAddr && (
            <FtmScanLink address={address}>
              {t('address.ftmscanButton')}
            </FtmScanLink>
          )}
        </TopBar>
        <AddReverseRecord account={account} currentAddress={address} />
      </AddressContainer>
      <Controls>
        <Filtering
          activeFilter={domainType}
          setActiveSort={setActiveSort}
          url={url}
        />

        {domainType === 'registrant' && (
          <RenewAll
            years={years}
            setYears={setYears}
            activeFilter={domainType}
            selectedNames={selectedNames}
            setCheckedBoxes={setCheckedBoxes}
            setSelectAll={setSelectAll}
            allNames={allNames}
            address={address}
            data={data}
            refetch={refetch}
            getterString="account.registrations"
          />
        )}
        <Sorting
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          activeFilter={domainType}
        />

        {domainType === 'registrant' && (
          <>
            <SelectAll>
              <Checkbox
                testid="checkbox-renewall"
                type="double"
                checked={selectAll}
                onClick={() => {
                  if (!selectAll) {
                    selectAllNames();
                  } else {
                    setCheckedBoxes({});
                  }
                  setSelectAll(selectAll => !selectAll);
                }}
              />
            </SelectAll>
          </>
        )}
      </Controls>
      <DomainList
        setSelectAll={setSelectAll}
        address={address}
        domains={domains}
        favourites={filterNormalised(favourites, 'labelName')}
        activeSort={activeSort}
        activeFilter={domainType}
        checkedBoxes={checkedBoxes}
        setCheckedBoxes={setCheckedBoxes}
        showBlockies={false}
      />
      <Pager
        variables={{ id: address, expiryDate }}
        currentPage={page}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        pageLink={`/address/${address}/${domainType}`}
        query={
          domainType === 'registrant'
            ? GET_REGISTRATIONS_SUBGRAPH
            : GET_DOMAINS_SUBGRAPH
        }
      />
    </>
  );
}
