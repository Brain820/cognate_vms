function VideoTimeLapse({ currentTime, duration }) {
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <span>
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
}

export default VideoTimeLapse;
