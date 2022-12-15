import { ChangeEvent } from 'react';
import { FaAngleDown } from 'react-icons/fa';

import { Side, TokenPair } from '../../types/types';

type Props = {
  side: Side;
  toggleModal: (side: Side) => void;
  pair: TokenPair;
  valueChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const TokenInputRow = ({ side, toggleModal, pair, valueChange }: Props) => {
  let content;
  if ((side === 'buy' && !pair.buy) || (side === 'sell' && !pair.sell)) {
    content = (
      <>
        <span>Select token</span>
        <FaAngleDown />
      </>
    );
  } else {
    content = (
      <>
        <img
          src={side === 'sell' ? pair.sell?.logoURI : pair.buy?.logoURI}
          alt=''
          className='h-6'
        />
        <span>{side === 'sell' ? pair.sell?.symbol : pair.buy?.symbol}</span>
        <div className='w-full'>
          <FaAngleDown />
        </div>
      </>
    );
  }

  return (
      <div className='bg-base-100 text-base-content shadow-xl w-full flex justify-between items-center rounded-lg mb-1 px-2'>
        <label htmlFor={side} />
        <input
          name={side}
          type='number'
          onChange={valueChange}
          min={0}
          step={0.1}
          placeholder='0'
          className='input-lg w-full max-w-xs bg-transparent text-3xl '
        />

        <button
          type='button' // important to prevent form submission and navigation
          onClick={() => toggleModal(side)}
          className='btn-sm btn-secondary rounded-2xl font-medium whitespace-nowrap px-4'>
          <div className='w-full flex gap-2 items-center justify-center '>{content}</div>
        </button>
      </div>
  );
};
