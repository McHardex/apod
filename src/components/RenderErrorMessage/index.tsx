import React from 'react';

type Props = {
  prevDay: () => void;
  nextDay: () => void;
  errorMessage: string;
};

const RenderErrorMessage: React.FC<Props> = ({ prevDay, nextDay, errorMessage }) => {
  return (
    <div className="error">
      <button className="next" onClick={prevDay}>
        prev date
      </button>
      <h1>{errorMessage}</h1>
      <button className="next" onClick={nextDay}>
        Next date
      </button>
    </div>
  );
};

export default RenderErrorMessage;
