import React from 'react';

const ErrorDialogueBox = (props) => {
  const { display, errorMessage, closeErrorBox } = props;

  React.useEffect(() => {
    const registered = document.addEventListener('keydown', (ev) => {
      if (ev.keyCode === 27) closeErrorBox();
    });
    return () => {
      document.removeEventListener('keydown', registered);
    };
  }, [ closeErrorBox ]);

  return display && (
    <div className="error-background">
      <div className="error-modal">
        <div>
          <h1> Something is wrong </h1>
          <p>{errorMessage}</p>
        </div>
        <span
          onClick={() => closeErrorBox()}
          className="close-button"
        >
        X
        </span>
      </div>
    </div>
  );
};

export default ErrorDialogueBox;
