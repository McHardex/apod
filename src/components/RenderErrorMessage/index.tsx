import React from 'react';
import { ReactComponent as NoPicture } from 'assets/images/void.svg';
import './index.scss';

type Props = {
  prevDay: () => void;
  rescueMe: () => void;
  errorMessage: string;
};

const RenderErrorMessage: React.FC<Props> = ({ rescueMe, errorMessage, prevDay, date }) => {
  return (
    <div className="error">
      <h1 className="error-message">{errorMessage}</h1>
      <NoPicture width="100%" height="80%" />
      <button onClick={formatDate(new Date()) === date ? prevDay : rescueMe}>Rescue me</button>
    </div>
  );
};

export default RenderErrorMessage;
