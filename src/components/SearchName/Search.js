import React, { useState } from 'react';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';

import { parseSearchTerm } from '../../utils/utils';
import '../../api/subDomainRegistrar';
import { withRouter } from 'react-router';
import searchIcon from '../../assets/search.svg';
import mq from 'mediaQuery';
import LanguageSwitcher from '../LanguageSwitcher';

const SearchForm = styled('form')`
  display: flex;
  position: relative;
  background: rgba(7, 9, 7, 0.28);
  border: 1px solid #232a31;
  box-sizing: border-box;
  backdrop-filter: blur(16px);

  /* Note: backdrop-filter has minimal browser support */
  border-radius: 18px;

  &:before {
    content: '';
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 17px;
    height: 17px;
    background: url(${searchIcon}) no-repeat;
    background-size: contain;
  }

  input {
    color: #eff3fb;
    background: transparent;
    padding: 10px 0 10px 55px;
    width: 100%;
    border: none;
    border-radius: 0;

    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    letter-spacing: -0.5px;

    ${mq.medium`
      width: calc(100% - 162px);
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder,
    &::placeholder {
      /* Chrome/Opera/Safari */
      color: #707b8f;
    }
  }

  button {
    ${p => (p && p.hasSearch ? 'opacity: 1;' : 'opacity: 0.6;')}
    font-family: Overpass;
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    letter-spacing: -0.5px;
    background: #1969ff;

    color: #eff3fb;
    height: 56px;
    width: 156px;
    border-radius: 15.2941px;
    margin: 8px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      ${p => (p && p.hasSearch ? 'cursor: pointer;' : 'cursor: default;')}
    }
  }
`;

function Search({ history, className, style }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(null);
  let input;

  const handleParse = e => {
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    );
  };
  const hasSearch = inputValue && inputValue.length > 0;
  return (
    <SearchForm
      className={className}
      style={style}
      action="#"
      hasSearch={hasSearch}
      onSubmit={async e => {
        e.preventDefault();
        if (!hasSearch) return;
        const type = await parseSearchTerm(inputValue);
        let searchTerm;
        if (input && input.value) {
          // inputValue doesn't have potential whitespace
          searchTerm = inputValue.toLowerCase();
        }
        if (!searchTerm || searchTerm.length < 1) {
          return;
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`);
          return;
        }

        input.value = '';
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`);
          return;
        } else {
          history.push(`/search/${searchTerm}`);
        }
      }}
    >
      <input
        placeholder={t('search.placeholder')}
        ref={el => (input = el)}
        onChange={handleParse}
      />
      <button disabled={!hasSearch} type="submit">
        {t('search.button')}
      </button>
    </SearchForm>
  );
}

const SearchWithRouter = withRouter(Search);

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  );
};

export { SearchWithRouter as Search };

export default SearchContainer;
