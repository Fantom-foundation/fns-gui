import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import store from './stores/reduxStore';

import { GlobalStateProvider } from 'globalState';
import 'globalStyles';
import './i18n';
import { handleNetworkChange } from './utils/utils';

window.addEventListener('load', async () => {
  const { client, networkId } = await handleNetworkChange();

  ReactDOM.render(
    <Suspense fallback={null}>
      <Provider store={store}>
        <GlobalStateProvider>
          <App initialClient={client} initialNetworkId={networkId} />
        </GlobalStateProvider>
      </Provider>
    </Suspense>,
    document.getElementById('root')
  );
});
