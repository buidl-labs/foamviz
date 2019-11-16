import React from 'react';

const ErrorDialogueBox = (props) => {
  const { display, errorMessage, closeErrorBox } = props;

  return display && (
    <div className="error-background">
      <div className="error-modal">
        <div>
        <h1> Something is wrong </h1>
        <p>{errorMessage}</p>
      </div>
        <p onClick={closeErrorBox}>X</p>
      </div>
    </div>
  );
};

export default ErrorDialogueBox;
