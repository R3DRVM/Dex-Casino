import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

import './Casino.scss';
import { Game1 } from './Game1';
import { Game2 } from './Game2';

export const Casino = () => {
  return (
    <div>
      <div className='flex gap-8'>
        <NavLink to={'game1'}>
          <div className='game-card'>Game1</div>
        </NavLink>
        <NavLink to={'game2'}>
          <div className='game-card'>Game2</div>
        </NavLink>
      </div>

      <Routes>
        <Route path='game1' element={<Game1 />} />
        <Route path='game2' element={<Game2 />} />
      </Routes>
    </div>
  );
};
