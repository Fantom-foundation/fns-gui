import { setupFNS } from 'fns-ui';

const INFURA_ID =
  window.location.host === 'app.fns.fantom.network'
    ? '90f210707d3c450f847659dc9a3436ea'
    : '58a380d3ecd545b2b5b3dad5d2b18bf0';

let fns = {},
  registrar = {},
  fnsRegistryAddress = undefined;

export async function setup({
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  customProvider,
  fnsAddress
}) {
  let option = {
    reloadOnAccountsChange: true,
    enforceReadOnly,
    enforceReload,
    customProvider,
    fnsAddress
  };
  if (enforceReadOnly) {
    option.infura = INFURA_ID;
  }
  const { fns: fnsInstance, registrar: registrarInstance } = await setupFNS(
    option
  );
  fns = fnsInstance;
  registrar = registrarInstance;
  fnsRegistryAddress =
    fnsAddress !== undefined ? fnsAddress : fns.registryAddress;
  return { fns, registrar };
}

export function getRegistrar() {
  return registrar;
}

export function getFnsAddress() {
  return fnsRegistryAddress;
}

export default function getFNS() {
  return fns;
}
