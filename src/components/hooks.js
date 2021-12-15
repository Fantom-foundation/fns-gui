import { useEffect, useReducer, useRef, useState } from 'react';
import { utils } from 'ethers';
import getEtherPrice from 'api/price';
import { useLocation } from 'react-router-dom';
import { loggedIn, logout } from './IPFS/auth';
import { getBlock, getProvider } from '@ensdomains/ui';
import BigNumber from 'bignumber.js';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function useScrollTo(pos) {
  useEffect(() => {
    window.scrollTo(0, pos);
  }, [pos]);
}

export function useEditable(
  initialState = {
    editing: false,
    newValue: '',
    pending: false,
    confirmed: false,
    txHash: undefined,
    uploading: false,
    authorized: loggedIn()
  }
) {
  const types = {
    UPDATE_VALUE: 'UPDATE_VALUE',
    START_EDITING: 'START_EDITING',
    STOP_EDITING: 'STOP_EDITING',
    START_PENDING: 'START_PENDING',
    RESET_PENDING: 'RESET_PENDING',
    SET_CONFIRMED: 'SET_CONFIRMED',
    START_UPLOADING: 'START_UPLOADING',
    STOP_UPLOADING: 'STOP_UPLOADING',
    START_AUTHORIZING: 'START_AUTHORIZING',
    STOP_AUTHORIZING: 'STOP_AUTHORIZING'
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const startEditing = () => dispatch({ type: types.START_EDITING });
  const stopEditing = () => dispatch({ type: types.STOP_EDITING });
  const updateValue = value => dispatch({ type: types.UPDATE_VALUE, value });
  const startPending = txHash =>
    dispatch({ type: types.START_PENDING, txHash });
  const resetPending = () => dispatch({ type: types.RESET_PENDING });
  const setConfirmed = () => dispatch({ type: types.SET_CONFIRMED });
  const startUploading = () => dispatch({ type: types.START_UPLOADING });
  const stopUploading = () => dispatch({ type: types.STOP_UPLOADING });
  const startAuthorizing = () => dispatch({ type: types.START_AUTHORIZING });
  const stopAuthorizing = () => dispatch({ type: types.STOP_AUTHORIZING });

  const actions = {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    resetPending,
    setConfirmed,
    startUploading,
    stopUploading,
    startAuthorizing,
    stopAuthorizing
  };

  function reducer(state, action) {
    switch (action.type) {
      case types.UPDATE_VALUE:
        return {
          ...state,
          newValue: action.value
        };
      case types.START_EDITING:
        return { ...state, editing: true, confirmed: false, pending: false };
      case types.STOP_EDITING:
        return {
          ...state,
          editing: false,
          confirmed: false,
          pending: false,
          uploading: false
        };
      case types.START_PENDING:
        return {
          ...state,
          pending: true,
          editing: false,
          uploading: false,
          txHash: action.txHash
        };
      case types.RESET_PENDING:
        return {
          ...state,
          pending: false,
          uploading: false,
          editing: false,
          txHash: undefined
        };
      case types.SET_CONFIRMED:
        return { ...state, pending: false, confirmed: true };
      case types.START_UPLOADING:
        return {
          ...state,
          uploading: true,
          confirmed: false,
          pending: false,
          newValue: ''
        };
      case types.STOP_UPLOADING:
        return {
          ...state,
          uploading: false,
          confirmed: false,
          pending: false,
          newValue: ''
        };
      case types.START_AUTHORIZING:
        return {
          ...state,
          authorized: true
        };
      case types.STOP_AUTHORIZING:
        logout();
        return {
          ...state,
          authorized: false
        };
      default:
        return state;
    }
  }

  return {
    state,
    actions
  };
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useEthPrice(enabled = true) {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(undefined);

  useEffect(() => {
    if (enabled) {
      getEtherPrice()
        .then(res => {
          setPrice(res);
          setLoading(false);
        })
        .catch(() => ''); // ignore error
    }
  }, [enabled]);

  return {
    loading,
    price
  };
}

export function useGasPrice(enabled = true) {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});

  useEffect(() => {
    try {
      const run = async () => {
        const provider = await getProvider();
        const blockDetails = await provider.getBlock('latest');
        if (blockDetails.baseFeePerGas) {
          const baseFeeWei = utils.formatUnits(
            blockDetails.baseFeePerGas,
            'wei'
          );
          const price = {
            slow: baseFeeWei + 2 * Math.pow(10, 9),
            fast: baseFeeWei * 1.5 + 2 * Math.pow(10, 9)
          };
          setPrice(price);
          setLoading(false);
        } else {
          const gasApi =
            'https://gftm.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata';
          const result = await fetch(gasApi);
          if (!result.ok) throw `Failed to get gas estimate: ${result.status}`;
          const data = await result.json();
          const slowPrice = new BigNumber(data.result.standardgaspricegwei)
            .div(new BigNumber(10).pow(9))
            .toString();
          const fastPrice = new BigNumber(data.result.rapidgaspricegwei)
            .div(new BigNumber(10).pow(9))
            .toString();
          let price = {
            slow: slowPrice,
            fast: fastPrice
          };
          setPrice(price);
          setLoading(false);
        }
      };
      run();
    } catch (e) {
      console.error('useGasPrice error: ', e);
    }
  }, [enabled]);

  return {
    loading,
    price
  };
}

export function useReferrer() {
  let location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get('utm_source');
}

export function useBlock() {
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState(undefined);

  useEffect(() => {
    getBlock()
      .then(res => {
        setBlock(res);
        setLoading(false);
      })
      .catch(() => ''); // ignore error
  }, []);

  return {
    loading,
    block
  };
}

export function useOnClickOutside(refs = [], handler) {
  useEffect(() => {
    const listener = event => {
      // Do nothing if any of given refs or descendants are clicked
      for (let i = 0; i < refs.length; i++) {
        if (!refs[i].current || refs[i].current.contains(event.target)) {
          return;
        }
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler]);
}

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
