import React from 'react';
import ReactPlayer from 'react-player';

export const Home = () => {
  const url = 'https://youtu.be/xF_2RFlr3U0?t=84';
  return (
    <div className='w-full flex flex-col gap-20 items-center'>
      <div className='hero '>
        <div className='hero-content text-center'>
          <div className='w-full text-center'>
            <h1 className='text-5xl font-bold whitespace-nowrap'>
              Viva Las vegas and Sin City Casino
            </h1>
          </div>
        </div>
      </div>
      <ReactPlayer url={url} playing={true} muted={false} />
    </div>
  );
};
