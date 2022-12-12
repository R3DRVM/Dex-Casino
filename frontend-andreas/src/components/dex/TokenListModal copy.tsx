import { FaSearch } from 'react-icons/fa';
import { Token } from '../../types/types';

type Props = {
  side: string;
  tokens: Token[];
  setPair: (prev: any) => void;
  setModalVisible: (prev: boolean) => void;
};

export const TokenListModal = ({ side, tokens, setPair, setModalVisible }: Props) => {
  console.log('🚀  file: SwapModal.tsx:12  tokens', tokens);
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
    <section className='flex flex-col gap-4 even-shadow bg-slate-600 p-4 rounded-2xl'>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold'>Select a token</h1>
        <p>X</p>
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
          className='bg-transparent border-none outline-none  w-full px-2 placeholder-inherit'
        />
      </div>
      <div className='grid grid-cols-3 gap-2 '>
        {frequentTokens.map(token => (
          <div
            key={token.address}
            onClick={() => handleSelectToken(token)}
            className='flex gap-2 p-2 rounded-xl bg-slate-400 hover:cursor-pointer hover:bg-slate-700 '>
            <img src={token.logoURI} alt='' />
            <p>{token.symbol}</p>
          </div>
        ))}
      </div>
      <div className='border-t border-slate-100'>
        <ul className='overflow-auto max-h-48 flex flex-col'>
          {tokens.map((token, index) => (
            <li
              key={token.address + index}
              className=' p-2 rounded-xl hover:bg-slate-400 hover:cursor-pointer'>
              <div
                className='w-full flex items-center gap-4 '
                onClick={() => handleSelectToken(token)}>
                <img src={token.logoURI} alt='' className='h-6 w-6 rounded-full' />
                <div>
                  <p className='font-bold'>{token.name}</p>
                  <p className='text-xs font-light'>{token.symbol}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
