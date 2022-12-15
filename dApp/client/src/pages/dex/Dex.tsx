import { ethers } from 'ethers';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { FaAngleDown } from 'react-icons/fa';
import { MdOutlineInfo, MdOutlineSwapVert } from 'react-icons/md';
import { erc20ABI, useAccount, useNetwork, useSigner } from 'wagmi';
import { sendTransaction, prepareSendTransaction } from '@wagmi/core';

import { ethTokendata } from '../../constants/tokenLists/goerli-tokens';
import { TokenListModal } from '../../components/dex/TokenListModal';
import { TokenInputRow } from '../../components/dex/TokenInputRow';
import { Modal } from '../../components/ui/modal/Modal';
import { FormValue, Side, Token, TokenPair } from '../../types/types';
import { useDexService } from '../../hooks/useDexService';

export const Dex = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const [currentPair, setCurrentPair] = useState<TokenPair>({
    sell: ethTokendata,
    buy: null,
  });
  const [side, setSide] = useState<Side>('sell');
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValue, setFormValue] = useState<FormValue>({
    amount: 0,
    side: 'sell',
  });
  const [pairPrice, setPairPrice] = useState<any>(null);

  const { getPrice, getQuote, getChainData, fetchTokenList } = useDexService();

  const getAndSetTokenList = useCallback(async () => {
    const tokenList = await fetchTokenList(chain?.id);
    setTokenList(tokenList.tokens);
  }, [chain]);

  useEffect(() => {
    getAndSetTokenList();
  }, [getAndSetTokenList]);

  useEffect(() => {
    const getAndSetPrice = async () => {
      const price = await getPrice(currentPair, formValue);
      setPairPrice(price);
    };
    getAndSetPrice();
  }, [currentPair, formValue, getPrice]);

  // handleSwap --------------------------------
  const handleSwap = async () => {
    const { side, amount } = formValue;
    if (!address || !signer || !currentPair.sell || !currentPair.buy || !side || !amount) return;

    // const approvalAmountBn = ethers.BigNumber.from('2').pow('256').sub('1');
    const sellTokenAddress = currentPair.sell.address;
    const { zeroXExchangeProxy } = getChainData();
    const sellTokenContract = new ethers.Contract(sellTokenAddress, erc20ABI, signer);

    // approve allowance
    try {
      const allowanceBn = await sellTokenContract.allowance(address, zeroXExchangeProxy);
      const allowance = ethers.utils.formatUnits(allowanceBn, 18).toString();

      // const approvalAmountBn = ethers.BigNumber.from('2').pow('256').sub('1'); // max uint256
      const approvalAmountBn = ethers.utils.parseEther(amount.toString());

      if (Number(allowance) < amount) {
        await sellTokenContract.approve(zeroXExchangeProxy, approvalAmountBn);
        // const approvalReceipt = await txApproval.wait(); // prob not needed. Doesn't usually take this long.
      }
    } catch (error) {
      console.log(error);
      return;
    }

    const quote = await getQuote(currentPair, side, amount, address);

    try {
      const params = {
        from: quote.from,
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasLimit: quote.gas,
      };

      const config = await prepareSendTransaction({
        chainId: quote.chainId,
        request: params,
        signer: signer,
      });

      // const receipt = await web3.eth.sendTransaction(quote); // This works
      const { wait } = await sendTransaction(config);
      await wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = async (side: Side) => {
    // await getAndSetTokenList();
    setSide(side);
    setModalVisible((prev: Boolean) => !prev);
  };

  const handleFlipBuySell = () => {
    setCurrentPair((prev: TokenPair) => ({
      sell: prev.buy,
      buy: prev.sell,
    }));
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>, side: Side) => {
    const value = Number(e.target.value);
    setFormValue({ amount: value, side });
    if (value <= 0) {
      setPairPrice(null);
    }
  };

  return (
    <>
      <Modal visible={modalVisible} setVisible={setModalVisible}>
        <TokenListModal
          side={side}
          tokens={tokenList}
          setPair={setCurrentPair}
          setModalVisible={setModalVisible}
          currentPair={currentPair}
        />
      </Modal>
      <section className='card card-compact max-w-md bg-base-300 text-base-content mx-4 '>
        <div className='card-body'>
          <h2 className='card-title'>Swap tokens</h2>
          <div className='w-full relative'>
            <TokenInputRow
              side='sell'
              // value={formValue} // fix this
              toggleModal={handleToggleModal}
              pair={currentPair}
              valueChange={e => handleValueChange(e, 'sell')}
            />
            <button
              className='btn-sm btn-secondary btn-square flip-button rounded-lg flex justify-center items-center border-4 border-solid border-base-300'
              onClick={handleFlipBuySell}>
              <MdOutlineSwapVert size='1.4rem' />
            </button>
            <TokenInputRow
              side='buy'
              // value={pairPrice.buyAmount ? pairPrice?.buyAmount / 10 ** currentPair?.buy?.decimals : 0}
              toggleModal={handleToggleModal}
              pair={currentPair}
              valueChange={e => handleValueChange(e, 'buy')}
            />
          </div>
          {pairPrice && (
            <div className='bg-base-100 text-base-content w-full flex gap-4 justify-between items-center rounded-lg mb-1 px-4 py-2'>
              <div className='flex gap-2 items-center'>
                <MdOutlineInfo />
                <p>
                  1 {currentPair.sell?.symbol} = {Number(pairPrice?.price).toPrecision(6)}{' '}
                  {currentPair.buy?.symbol}
                </p>
              </div>
              <p>Estimated gas: {pairPrice.estimatedGas} </p>
              <FaAngleDown />
            </div>
          )}

          <div className='card-actions justify-end'>
            <button onClick={handleSwap} className='btn btn-accent w-full'>
              Swap
            </button>
            {currentPair.buy && formValue.amount > 0 && (
              <>
                <p>decimals: {currentPair.buy?.decimals} </p>
                <p>
                  amount to buy:{' '}
                  {(pairPrice?.buyAmount / 10 ** currentPair.buy?.decimals).toPrecision(4)}{' '}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
