import React from 'react';
import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import mq from 'mediaQuery';

import AddFavourite from '../AddFavourite/AddFavourite';
import QueryAccount from '../QueryAccount';
import ExpiryDate from './ExpiryDate';
import Loader from '../Loader';
import { humaniseName } from '../../utils/utils';
import Checkbox from '../Forms/Checkbox';

const CheckBoxContainer = styled('div')`
  margin: 5px;
`;

const DomainContainer = styled(Link)`
  &:before {
    content: '';
    background: ${p => {
      switch (p.state) {
        case 'Yours':
          return '#52E5FF';
        case 'Open':
          return '#42E068';
        case 'Auction':
        case 'Reveal':
          return 'linear-gradient(-180deg, #42E068 0%, #52E5FF 100%)';
        case 'Owned':
          return '#CACACA';
        case 'Forbidden':
          return 'black';
        case 'NotYetAvailable':
          return 'red';
        default:
          return 'red';
      }
    }};
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  color: #2b2b2b;
  padding: 20px;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.colors.componentBgColor};
  background: ${({ percentDone, theme }) =>
    percentDone
      ? `
  linear-gradient(to right, rgba(128, 255, 128, 0.1) 0%, rgba(82,229,255, 0.1) ${percentDone}%,#ffffff ${percentDone}%)`
      : theme.colors.componentBgColor};
  border-radius: 6px;
  height: 65px;
  display: grid;
  height: auto;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  align-items: center;
  font-size: 22px;
  margin-bottom: 4px;
  transition: 0.2s all;

  ${mq.medium`
    grid-template-columns: 1fr minmax(150px,350px) 100px 50px 50px;
    grid-template-rows: 39px;
  `}

  z-index: 1;
  .label-container {
    display: flex;
  }

  &:visited {
    color: #2b2b2b;
  }
`;

const RightContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const DomainName = styled('h2')`
  font-family: Overpass;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: ${p => p.theme.colors.textColor};
`;

const LabelContainer = styled('div')`
  margin-right: 20px;
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: -0.5px;

  color: #0fe698;
  display: none;
  align-items: center;
`;

const LabelText = styled('div')``;

const Label = ({ domain, isOwner }) => {
  const { t } = useTranslation();
  let text;
  switch (domain.state) {
    case 'Open':
      text = t('singleName.domain.state.available');
      break;
    case 'Auction':
      text = t('singleName.domain.state.auction');
      break;
    case 'Owned':
      text = t('singleName.domain.state.owned');
      break;
    default:
      text = t('singleName.domain.state.default');
  }

  if (isOwner) {
    text = t('singleName.domain.state.owned');
  }

  return (
    <LabelContainer className="label-container">
      <LabelText>{text}</LabelText>
    </LabelContainer>
  );
};

const Domain = ({
  domain,
  isSubDomain,
  className,
  isFavourite,
  loading,
  checkedBoxes = {},
  setCheckedBoxes,
  setSelectAll
}) => {
  if (loading) {
    return (
      <DomainContainer state={'Owned'} className={className} to="">
        <Loader />
      </DomainContainer>
    );
  }
  const nameArray = domain.name.split('.');
  return (
    <QueryAccount>
      {({ account }) => {
        let isOwner = false;
        if (
          !domain.available &&
          domain.owner &&
          parseInt(domain.owner, 16) !== 0
        ) {
          isOwner =
            account &&
            domain.owner &&
            domain.owner.toLowerCase() === account.toLowerCase();
        }
        const percentDone = 0;
        let expiryDate = domain.expiryDate;
        if (domain.expiryTime) {
          expiryDate = parseInt(domain.expiryTime.getTime() / 1000);
        }
        return (
          <DomainContainer
            to={`/name/${domain.name}`}
            state={isOwner ? 'Yours' : domain.state}
            className={className}
            percentDone={percentDone}
            data-testid={`domain-${domain.name}`}
          >
            <DomainName state={isOwner ? 'Yours' : domain.state}>
              {humaniseName(domain.name)}
            </DomainName>
            <ExpiryDate expiryDate={expiryDate} name={domain.name} />
            <Label domain={domain} isOwner={isOwner} />
            <RightContainer>
              <AddFavourite
                domain={domain}
                isSubDomain={isSubDomain}
                isFavourite={isFavourite}
              />
            </RightContainer>
            <RightContainer>
              {expiryDate && (
                <CheckBoxContainer>
                  <Checkbox
                    testid={`checkbox-${domain.name}`}
                    checked={checkedBoxes[domain.name]}
                    onClick={e => {
                      e.preventDefault();
                      setCheckedBoxes &&
                        setCheckedBoxes(prevState => {
                          return {
                            ...prevState,
                            [domain.name]: !prevState[domain.name]
                          };
                        });
                      if (checkedBoxes[domain.name]) {
                        setSelectAll(false);
                      }
                    }}
                  />
                </CheckBoxContainer>
              )}
            </RightContainer>
          </DomainContainer>
        );
      }}
    </QueryAccount>
  );
};

export default Domain;
