import React from 'react';
import ReactPlayer from 'react-player';

export const Home = () => {
  const url = 'https://youtu.be/xF_2RFlr3U0?t=84';
  return (
    <>
      <ReactPlayer url={url} playing={true} />
    </>
  );
};
