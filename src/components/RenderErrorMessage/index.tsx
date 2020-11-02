import React from 'react';
import { ReactComponent as NoPicture } from 'assets/images/void.svg';
import { formatDate } from 'utilities';
import './index.scss';

type Props = {
  prevDay: () => void;
  nextDay: () => void;
  errorMessage: string;
  date: string;
};

const RenderErrorMessage: React.FC<Props> = ({ prevDay, nextDay, errorMessage, date }) => {
  return (
    <div className="error">
      <h1 className="error-message">{errorMessage}</h1>
      <NoPicture width="100%" height="80%" />
      <button onClick={formatDate(new Date()) === date ? prevDay : nextDay}>Rescue me</button>
    </div>
  );
};

export default RenderErrorMessage;
