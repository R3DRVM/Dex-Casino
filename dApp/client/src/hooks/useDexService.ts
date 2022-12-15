import { useCallback } from 'react';

import axios from 'axios';
import { FormValue, Side, TokenPair } from '../types/types';
import { useNetwork } from 'wagmi';

export const useDexService = () => {
  const { chain } = useNetwork();

  // ------------------------------ getChainData ------------------------------
  const getChainData = useCallback(() => {
    let zeroXExchangeProxy;
    let tokenListUrl;
    let zeroXApi;
    switch (chain?.id) {
      case 5:
        zeroXExchangeProxy = '0xf91bb752490473b8342a3e964e855b9f9a2a668e';
        tokenListUrl = '';
        zeroXApi = 'https://goerli.api.0x.org';
        break;
      case 137:
        zeroXExchangeProxy = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
        tokenListUrl =
          'https://api-polygon-tokens.polygon.technology/tokenlists/polygonTokens.tokenlist.json';
        zeroXApi = 'https://polygon.api.0x.org/';
        break;
      case 80001:
        // zeroXExchangeProxy = '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b';
        zeroXExchangeProxy = '0xF471D32cb40837bf24529FCF17418fC1a4807626';
        tokenListUrl =
          'https://api-polygon-tokens.polygon.technology/tokenlists/testnet.tokenlist.json';
        zeroXApi = 'https://mumbai.api.0x.org/';
        break;
      default: // mainnet
        zeroXExchangeProxy = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
        tokenListUrl = 'https://tokens.coingecko.com/uniswap/all.json';
        zeroXApi = 'https://api.0x.org/';
    }
    return { zeroXExchangeProxy, tokenListUrl, zeroXApi };
  }, [chain]);

  const axiosZer0XProxy = useCallback(
    axios.create({
      baseURL: getChainData().zeroXApi,
    }),
    [getChainData]
  );

  // ------------------------------ getPrice ------------------------------
  const getPrice = useCallback(
    async (currentPair: TokenPair, formValue: FormValue, value?: number) => {
      if (!currentPair.sell || !currentPair.buy) return;
      const valueToSend = value ? value : formValue.amount;
      if (valueToSend <= 0) return;

      const sellOrBuy: string = formValue.side === 'sell' ? 'sellAmount' : 'buyAmount';
      const { sell: sellToken, buy: buyToken } = currentPair;
      const params = {
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        [sellOrBuy]: (Number(valueToSend) * 10 ** sellToken.decimals).toString(),
      };

      try {
        const { data } = await axiosZer0XProxy.get('/swap/v1/price', { params });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    [axiosZer0XProxy]
  );

  // -------------------------------- getQuote --------------------------------
  const getQuote = async (
    currentPair: TokenPair,
    side: Side,
    value: number,
    takerAddress: string
  ) => {
    const { sell: sellToken, buy: buyToken } = currentPair;
    if (!sellToken || !buyToken) return;
    let sellOrBuyQuery;
    let decimals;
    if (side === 'sell') {
      sellOrBuyQuery = 'sellAmount';
      decimals = sellToken.decimals;
    } else {
      sellOrBuyQuery = 'buyAmount';
      decimals = buyToken.decimals;
    }

    const amountDecimals = (Number(value) * 10 ** decimals).toString();
    const params = {
      sellToken: sellToken?.address,
      buyToken: buyToken?.address,
      [sellOrBuyQuery]: amountDecimals,
      takerAddress,
      // skipValidation: true,
    };

    try {
      const { data } = await axiosZer0XProxy.get('/swap/v1/quote', { params });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  //   ------------------------------ fetchTokenList ------------------------------
  const fetchTokenList = async (chainId: number | undefined) => {
    if (typeof chainId !== 'number') return;
    if (chainId === 5) {
      return await import('../constants/tokenLists/goerli-tokens.json');
    } else if (chainId === 80001) {
      return await import('../constants/tokenLists/mumbai-tokens.json');
    } else {
      const { tokenListUrl } = getChainData();
      const { data } = await axios.get(tokenListUrl);
      return data;
    }
  };

  return { getPrice, getQuote, fetchTokenList, getChainData, cgAxios: axiosZer0XProxy };
};
