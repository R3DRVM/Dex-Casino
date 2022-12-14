import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../assets/Logo';

export const Header = () => {
  return (
    <header className='navbar bg-base-300 whitespace-nowrap font-bold'>
      <div className='navbar-start'>
        <nav className='dropdown'>
          <label tabIndex={0} className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <NavLink to={'/dex'}>Dex</NavLink>
            </li>

            <li>
              <NavLink to={'/casino'}>Casino</NavLink>
            </li>
          </ul>
        </nav>
        <NavLink to={'/'} className='btn btn-ghost normal-case text-xl'>
          <Logo />
        </NavLink>
      </div>
      <nav className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <NavLink to={'/dex'}>Dex</NavLink>
          </li>
          <li>
            <NavLink to={'/casino'}>Casino</NavLink>
          </li>
        </ul>
      </nav>
      <div className='navbar-end text-xs font-extralight'>
        {/* <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} /> */}
        <ConnectButton />
      </div>
    </header>
  );
};
