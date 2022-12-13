import { FaSearch } from 'react-icons/fa';
import { Token, TokenPair } from '../../types/types';

type SwapModalProps = {
  side: keyof TokenPair;
  tokens: Token[];
  setPair: (prev: any) => void;
  setModalVisible: (prev: boolean) => void;
  currentPair: TokenPair;
};

export const TokenListModal = ({
  side,
  tokens,
  setPair,
  setModalVisible,
  currentPair,
}: SwapModalProps) => {
  const freqentSymbols = ['ETH', 'UNI', 'LINK', 'DAI', 'WETH', 'WBTC', 'MTK'];
  const frequentTokens = tokens.filter(token => freqentSymbols.includes(token.symbol));

  const handleSelectToken = (token: Token) => {
    setPair((prev: any) => ({
      ...prev,
      [side]: token,
    }));
    setModalVisible(false);
  };

  return (
    <section className='card card-compact w-96 bg-base-100 shadow-xl'>
      <div className='card-body flex flex-col gap-4 w-full'>
        <div className='w-full flex justify-between items-center'>
          <h2 className='card-title'>Select a token</h2>
          <button
            type='button'
            className='btn btn-sm btn-circle btn-outline'
            onClick={() => setModalVisible(false)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
          {/* <p className='text-right text-xl'>X</p> */}
        </div>
        <div className='flex items-center border border-slate-100 rounded-xl px-4 py-2'>
          <label htmlFor='search'>
            <FaSearch />
          </label>
          <input
            type='text'
            name='search'
            id='search'
            placeholder='search name or paste address'
            className='input input-bordered input-xs w-full max-w-xs placeholder-inherit'
          />
        </div>
        <div className='grid grid-cols-3 gap-2 '>
          {frequentTokens.map(token => (
            <button
              key={token.address}
              onClick={() => handleSelectToken(token)}
              className={`btn btn-ghost rounded-3xl ${
                token.symbol === currentPair[side]?.symbol && 'bg-slate-400 text-white'
              }`}>
              <img src={token.logoURI} alt='' />
              <p>{token.symbol}</p>
            </button>
          ))}
        </div>
        <div className='border-t border-slate-100'>
          <ul className='overflow-auto max-h-48 flex flex-col'>
            {tokens.map((token, index) => (
              <li
                key={token.address + index}
                // className=' p-2 rounded-xl hover:bg-slate-400 hover:cursor-pointer'
              >
                <button
                  className='btn btn-ghost w-full flex justify-start gap-4 '
                  onClick={() => handleSelectToken(token)}>
                  <img src={token.logoURI} alt='' className='h-6 w-6 rounded-full' />
                  <div>
                    <p className='font-bold'>{token.name}</p>
                    <p className='text-xs font-light'>{token.symbol}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
