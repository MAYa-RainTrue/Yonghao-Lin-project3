function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Timer({ secondsElapsed, status }) {
    return (
        <div className="game-timer">
            <span className="game-timer__label">Time</span>
            <span className="game-timer__value">{formatTime(secondsElapsed)}</span>
            <span className="game-timer__status">
        {status === 'won' ? 'Completed' : 'Playing'}
      </span>
        </div>
    );
}

export default Timer;