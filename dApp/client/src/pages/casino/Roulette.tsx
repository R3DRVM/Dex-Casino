import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import {
  erc20ABI,
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSigner,
} from 'wagmi';
import { roulettePockets } from '../../assets/rouletteBoard';
import { getRandomRoulettePocket } from '../../utils/getRandom';
import { casinoAddresses } from '../../constants/casino';
import { casinoAbi } from '../../constants/casino';
import { ethers } from 'ethers';

interface DisplayStats {
  winningNumber: string;
  reward: number;
  winningColor: string;
  winningParity: string;
}

// type contractAddressesInterface = {
//   [key: string]: `0x${string}`[];
// };
type contractAddressesInterface = {
  [key: string]: string[];
};

export const Roulette = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [winningIndex, setWinningIndex] = useState(0);
  const [gameStats, setGameStats] = useState<DisplayStats | undefined>();
  // console.log('🚀  file: Roulette.tsx:17  gameStats', gameStats);
  const [chosenPocket, choosePocket] = useState<string | undefined>();
  const [autoChoose, setAutoChoose] = useState(false);
  const [win, setWinner] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [potentialWin, setPotentialWin] = useState(0);
  console.log('🚀  file: Roulette.tsx:43  potentialWin', potentialWin);

  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const chainId = chain?.id.toString();
  const addresses: contractAddressesInterface = casinoAddresses;
  const [casinoAddress, setCasinoAddress] = useState<string | undefined>();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();
  const casinoContract = useContract({
    address: casinoAddress,
    abi: casinoAbi,
    signerOrProvider: signer,
  });
  const tokenContract = useContract({
    address: tokenAddress,
    abi: erc20ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (!chainId) return;
    const _casinoAddress = addresses[chainId][0];
    setCasinoAddress(_casinoAddress);
  }, [chainId, addresses]);

  useEffect(() => {
    const getTokenAddress = async () => {
      if (!casinoContract) return;
      try {
        const _tokenAddress = await casinoContract.paymentToken();
        setTokenAddress(_tokenAddress);
      } catch (error) {
        console.log(error);
      }
    };
    getTokenAddress();
  }, [casinoContract]);

  useEffect(() => {
    if (gameStats?.winningNumber === chosenPocket) {
      console.log('Winner ');
      // tell BE we have a winner
    } else {
      console.log('Loserrrrrrrrrrrrrrrrrr');
      return;
    }
    
  }, [gameStats?.winningNumber]);

  const textColor = () => {
    if (!chosenPocket) return '';
    if (parseInt(chosenPocket) > 36 || parseInt(chosenPocket) < 0) {
      return 'text-red-500';
    } else return '';
  };

  const handleChangePocket = () => {
    const checkBoxBeforeEvent = autoChoose;
    setAutoChoose(!autoChoose);
    checkBoxBeforeEvent
      ? choosePocket(undefined)
      : choosePocket(getRandomRoulettePocket().toString());
  };

  const handleBetChange = () => {
    setBetAmount(betAmount + 1);
    setPotentialWin((betAmount + 1) * 36); // 0.8 is 1 - betFee. Cold also get this from contract.
  };

  const handleSpin = async () => {
    console.log('gonna spin');
    if (!casinoAddress || !tokenContract || !betAmount || !account) {
      console.log("Missing data, can't spin");
      return;
    }
    const betFeeBn = await casinoContract?.betFee();
    const betFee = ethers.utils.formatEther(betFeeBn);
    console.log('🚀  file: Roulette.tsx:115  betFee', betFee);

    console.log('Past checks');
    setWinner(false);
    const multiplier = 36;
    const betAmountBn = ethers.utils.parseEther(betAmount.toString());
    const allowanceBn = await tokenContract.allowance(account, `0x${casinoAddress.slice(2)}`);
    const allowance = ethers.utils.formatEther(allowanceBn).toString();
    const transferAmount = betAmount / (1 - Number(betFee));
    console.log('🚀  file: Roulette.tsx:129  transferAmount', transferAmount);
    const transferAmountBn = ethers.utils.parseEther(transferAmount.toString());
    let txapproval;
    try {
      if (Number(allowance) < transferAmount) {
        txapproval = await tokenContract.approve(`0x${casinoAddress.slice(2)}`, transferAmountBn);
        console.log('🚀  file: Roulette.tsx:109  txapproval', txapproval);
      }
      await casinoContract?.bet(betAmount.toString(), multiplier.toString());
      const currentBetsBn = await casinoContract?.bets(account);
      const currentBet = ethers.utils.formatEther(currentBetsBn);
      console.log('🚀  file: Roulette.tsx:126  currentBets', currentBet);

      setWinningIndex(getRandomRoulettePocket());
      setMustSpin(true);
      await txapproval?.wait();
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <>
      {win ? (
        <div className='alert alert-success shadow-lg m-5'>
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current flex-shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>We have a winner!</span>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className='card flex flex-row'>
        <div className={'stats stats-vertical shadow rounded-2xl border-4 border-primary'}>
          <div className='stat'>
            <div className={'stat-title text-primary'}>Winning Number</div>
            <div className='stat-value text-primary pb-2'>
              {gameStats ? gameStats.winningNumber : '__'}
            </div>
            <div className='stat-desc'>
              {gameStats ? `Parity: ${gameStats.winningParity.toUpperCase()}` : 'Spin to Play'}
            </div>
            <div className='stat-desc'>
              {gameStats ? `Color: ${gameStats.winningColor.toUpperCase()}` : ''}
            </div>
          </div>
          <div className='stat'>
            <input
              type='text'
              placeholder={autoChoose ? chosenPocket : 'Enter winning number'}
              className={'input input-bordered input-primary w-full max-w-xs ' + textColor()}
              disabled={autoChoose}
              onChange={({ target: { value } }) => {
                if (0 <= parseInt(value) && parseInt(value) <= 36) {
                  choosePocket(value);
                } else {
                  choosePocket(undefined);
                }
              }}
            />
            <div className='divider'>OR</div>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text text-secondary'>I'm feeling lucky!</span>
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={autoChoose}
                  onChange={() => {
                    choosePocket(undefined);
                    handleChangePocket();
                  }}
                />
              </label>
            </div>
          </div>

          <div className='stat'>
            <div className='stat-title'>Bet Secured</div>
            <div className='stat-value'>{betAmount} DEX</div>
            <div className='stat-actions'>
              <button className='btn btn-sm btn-secondary' onClick={handleBetChange}>
                Increase bet
              </button>
            </div>
          </div>
        </div>
        <div className='game-card flex flex-col ml-5 items-center'>
          <Wheel
            mustStartSpinning={mustSpin}
            perpendicularText={true}
            data={roulettePockets}
            prizeNumber={winningIndex}
            textColors={['white']}
            outerBorderWidth={10}
            outerBorderColor={'#3d251e'}
            innerBorderWidth={40}
            innerBorderColor={'#3d251e'}
            innerRadius={45}
            textDistance={90}
            radiusLineWidth={0}
            onStopSpinning={() => {
              setMustSpin(false);
              const gameStats = {
                winningNumber: roulettePockets[winningIndex].option,
                winningColor: roulettePockets[winningIndex].style.backgroundColor,
                winningParity: !(parseInt(roulettePockets[winningIndex].option) % 2)
                  ? 'even'
                  : 'odd',
                reward: 180,
              };
              setGameStats(gameStats);
              if (gameStats.winningNumber === chosenPocket) setWinner(true);
              setBetAmount(0);
              setPotentialWin(0);
            }}
          />

          <button
            className='btn btn-wide btn-primary'
            onClick={handleSpin}
            disabled={!chosenPocket || betAmount === 0}>
            SPIN
          </button>
        </div>
      </div>
    </>
  );
};
