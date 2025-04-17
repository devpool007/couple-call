import React, { useState, useEffect } from 'react';

function Timer({ startTime }) {
  const [duration, setDuration] = useState('00:00:00');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDuration(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <div className="text-green-400 font-mono text-sm md:text-base">
      {duration}
    </div>
  );
}

export default Timer;