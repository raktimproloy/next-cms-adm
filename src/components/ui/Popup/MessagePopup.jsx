import React, { useEffect } from 'react';

function MessagePopup({ showMessagePopup = true, setShowMessagePopup, popupText, aleart = 'error' }) {
  useEffect(() => {
    let timeoutId;

    if (showMessagePopup) {
      // Set a timeout to automatically hide the popup after 1 second
      timeoutId = setTimeout(() => {
        setShowMessagePopup(false);
      }, 3000);
    }

    // Cleanup function to clear the timeout if the component unmounts or showMessagePopup changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showMessagePopup, setShowMessagePopup]);

  return (
    <div className={`fixed left-0 w-screen flex justify-center ease-in-out duration-200 ${showMessagePopup ? 'top-3' : 'top-[-25%]'} `} style={{ zIndex: '999999' }}>
      <div className={`${aleart === 'success' ? 'bg-blue-800' : 'bg-red-700'} px-7 rounded text-white border-b-2`}>
        <div className='flex items-center py-3'>
          {aleart === 'success' ? (
            <svg
              viewBox='0 0 24 24'
              className='mr-3'
              width={'30px'}
              height={'30px'}
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              aria-labelledby='okIconTitle'
              stroke='#ffffff'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
              color='#ffffff'
            >
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <title id='okIconTitle'>Ok</title> <polyline points='4 13 9 18 20 7'></polyline>{' '}
              </g>
            </svg>
          ) : (
            <svg
              fill='#ffffff'
              className='mr-3'
              width={'30px'}
              height={'30px'}
              viewBox='0 0 32 32'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <path d='M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z'></path>{' '}
              </g>
            </svg>
          )}

          {popupText}
        </div>
      </div>
    </div>
  );
}

export default MessagePopup;
