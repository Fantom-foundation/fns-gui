import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled/macro';
import { Query } from 'react-apollo';
import DomainItem from '../components/DomainItem/DomainItem';
import { getNamehash } from 'fns-ui';
import { useQuery } from 'react-apollo';
import PageTitle from '../components/Layout/PageTitle';
import SearchDefault from '../components/SearchName/Search';
import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_OWNER,
  GET_REGISTRATIONS_BY_IDS_SUBGRAPH
} from '../graphql/queries';

import mq from 'mediaQuery';
import moment from 'moment';

import { H2 as DefaultH2 } from '../components/Typography/Basic';
import LargeHeart from '../components/Icons/LargeHeart';
import RenewAll from '../components/Address/RenewAll';
import Checkbox from '../components/Forms/Checkbox';
import { useAccount } from '../components/QueryAccount';
import { filterNormalised } from '../utils/utils';

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
  margin: 2em 0;
`;

const NoDomainsContainer = styled('div')`
  margin-top: 40px;
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.colors.componentBgColor};
  border-radius: 16px;
  margin-bottom: 40px;

  h2 {
    color: ${p => p.theme.colors.grayColor};
    font-weight: 100;
    margin-bottom: 0;
    padding: 0;
    margin-top: 20px;
    text-align: center;
    max-width: 500px;
  }

  p {
    color: #707b8f;
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    line-height: 1.3em;
    text-align: center;
    max-width: 400px;
  }
`;

const H2 = styled(DefaultH2)`
  margin-top: 50px;
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
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
    background: transparent;
    border-radius: 16px;
  }
`;

const NoDomains = () => {
  const { t } = useTranslation();
  return (
    <NoDomainsContainer>
      <LargeHeart />
      <h2>{t('favourites.nofavouritesDomains.title')}</h2>
      <p>{t('favourites.nofavouritesDomains.text')}</p>
    </NoDomainsContainer>
  );
};

function getAvailable(expiryDate) {
  let e = moment(parseInt(expiryDate * 1000));
  let e2 = moment().subtract(90, 'days');
  return e2.diff(e) > 0;
}

function getDomainState(owner, available) {
  if (!owner || available) return 'Open';
  return parseInt(owner, 16) === 0 ? 'Open' : 'Owned';
}

function Favourites() {
  const { t } = useTranslation();
  let [years, setYears] = useState(1);
  let [checkedBoxes, setCheckedBoxes] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const account = useAccount();

  useEffect(() => {
    document.title = 'FNS Favourites';
  }, []);
  const { data: { favourites: favouritesWithUnnormalised } = [] } = useQuery(
    GET_FAVOURITES
  );
  const { data: { subDomainFavourites } = [] } = useQuery(
    GET_SUBDOMAIN_FAVOURITES
  );
  const favourites = filterNormalised(favouritesWithUnnormalised, 'name');
  const ids = favourites && favourites.map(f => getNamehash(f.name));
  const { data: { registrations } = [], refetch } = useQuery(
    GET_REGISTRATIONS_BY_IDS_SUBGRAPH,
    {
      variables: { ids }
    }
  );

  if (!favourites || (favourites.length === 0 && !registrations)) {
    return <NoDomains />;
  }
  let favouritesList = [];
  if (favourites.length > 0) {
    if (registrations && registrations.length > 0) {
      favouritesList = favourites.map(f => {
        let r = registrations.filter(
          a => a.domain.id === getNamehash(f.name)
        )[0];
        return {
          name: f.name,
          owner: r && r.domain.owner.id,
          available: getAvailable(r && r.expiryDate),
          expiryDate: r && r.expiryDate
        };
      });
    } else {
      // Fallback when subgraph is not returning result
      favouritesList = favourites.map(f => {
        return {
          name: f.name
        };
      });
    }
  }

  const hasFavourites =
    (favouritesList && favouritesList.length > 0) ||
    (subDomainFavourites && subDomainFavourites.length > 0);
  if (!hasFavourites) {
    return (
      <FavouritesContainer data-testid="favourites-container">
        <PageTitle>{t('favourites.favouriteTitle')}</PageTitle>
        <Search />
        <NoDomains>
          <LargeHeart />
          <h2>{t('favourites.nofavouritesDomains.title')}</h2>
          <p>{t('favourites.nofavouritesDomains.text')}</p>
        </NoDomains>
      </FavouritesContainer>
    );
  }

  const selectedNames = Object.entries(checkedBoxes)
    .filter(([key, value]) => value)
    .map(([key]) => key);

  const allNames = favouritesList.map(f => f.name);
  const selectAllNames = () => {
    const obj = favouritesList.reduce((acc, f) => {
      if (f.expiryDate) {
        acc[f.name] = true;
      }
      return acc;
    }, {});
    setCheckedBoxes(obj);
  };
  let data = [];
  const checkedOtherOwner =
    favouritesList.filter(
      f =>
        f.expiryDate &&
        f.owner !== account?.toLowerCase() &&
        checkedBoxes[f.name]
    ).length > 0;
  const canRenew = favouritesList.filter(f => f.expiryDate).length > 0;
  return (
    <FavouritesContainer data-testid="favourites-container">
      <PageTitle>{t('favourites.favouriteTitle')}</PageTitle>
      <Search />
      {canRenew && (
        <>
          <RenewAll
            years={years}
            setYears={setYears}
            selectedNames={selectedNames}
            setCheckedBoxes={setCheckedBoxes}
            setSelectAll={setSelectAll}
            allNames={allNames}
            refetch={refetch}
            data={data}
            getterString="registrations"
            checkedOtherOwner={checkedOtherOwner}
          />
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

      {favouritesList &&
        favouritesList.map(domain => {
          return (
            <DomainItem
              domain={{
                ...domain,
                state: getDomainState(domain.owner, domain.available),
                owner: domain.owner
              }}
              isFavourite={true}
              checkedBoxes={checkedBoxes}
              setCheckedBoxes={setCheckedBoxes}
              setSelectAll={setSelectAll}
            />
          );
        })}
      {subDomainFavourites &&
        subDomainFavourites.map(domain => (
          <Query
            query={GET_OWNER}
            variables={{ name: domain.name }}
            key={domain.name}
          >
            {({ loading, error, data }) => {
              if (error)
                return <div>{(console.log(error), JSON.stringify(error))}</div>;
              return (
                <DomainItem
                  loading={loading}
                  domain={{
                    ...domain,
                    state: getDomainState(data?.getOwner, false),
                    owner: data?.getOwner
                  }}
                  isSubDomain={true}
                  isFavourite={true}
                />
              );
            }}
          </Query>
        ))}
    </FavouritesContainer>
  );
}

const FavouritesContainer = styled('div')`
  padding-bottom: 20px;
`;

export default Favourites;
