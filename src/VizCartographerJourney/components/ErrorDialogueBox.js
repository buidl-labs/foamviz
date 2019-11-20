import React from 'react';

const ErrorDialogueBox = (props) => {
  const { display, errorMessage, closeErrorBox } = props;

  const ifESCpressed = (event) => {
    const code = event.keyCode || event.which;
    if (code === 27) closeErrorBox();
  };

  return display && (
    <div className="error-background">
      <div className="error-modal">
        <div>
          <h1> Something is wrong </h1>
          <p>{errorMessage}</p>
        </div>
        <span
          onClick={() => closeErrorBox}
          onKeyPress={ifESCpressed}
          className="close-button"
        >
        X
        </span>
      </div>
    </div>
  );
};

export default ErrorDialogueBox;
