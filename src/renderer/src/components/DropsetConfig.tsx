import { useState, useRef } from 'react';

export const DropsetConfig = ({ onApply }) => {
    const [sets, setSets] = useState(4);
    const [reps, setReps] = useState(8);

    const [beginningWeightState, setBeginningWeightState] = useState({
        weight: 50,
        sliderPosition: (50 / 300) * 100
    });

    const [endWeightState, setEndWeightState] = useState({
        weight: 30,
        sliderPosition: (30 / 300) * 100
    });

    const beginningWeightRef = useRef(50);
    const endWeightRef = useRef(30);

    const incrementSets = () => setSets(prev => Math.min(prev + 1, 9));
    const decrementSets = () => setSets(prev => Math.max(1, prev - 1));
    const incrementReps = () => setReps(prev => Math.min(prev + 1, 30));
    const decrementReps = () => setReps(prev => Math.max(1, prev - 1));

    const startBeginningWeightSlide = (e) => {
        e.preventDefault();
        const slider = e.currentTarget;
        if (e.type === 'mousedown') {
            slider.addEventListener('mousemove', handleBeginningWeightMouseMove);
            document.addEventListener('mouseup', handleBeginningWeightMouseUp);
        } else if (e.type === 'touchstart') {
            slider.addEventListener('touchmove', handleBeginningWeightTouchMove);
            document.addEventListener('touchend', handleBeginningWeightTouchEnd);
        }
    };

    const startEndWeightSlide = (e) => {
        e.preventDefault();
        const slider = e.currentTarget;
        if (e.type === 'mousedown') {
            slider.addEventListener('mousemove', handleEndWeightMouseMove);
            document.addEventListener('mouseup', handleEndWeightMouseUp);
        } else if (e.type === 'touchstart') {
            slider.addEventListener('touchmove', handleEndWeightTouchMove);
            document.addEventListener('touchend', handleEndWeightTouchEnd);
        }
    };

    const handleBeginningWeightMove = (clientX) => {
        const slider = document.querySelector('.beginning-weight-slider');
        if (slider) {
            const rect = slider.getBoundingClientRect();
            const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const weightlbs = Math.round((newPosition / 100) * 300);

            beginningWeightRef.current = weightlbs;

            setBeginningWeightState({
                weight: weightlbs,
                sliderPosition: newPosition
            });
        }
    };

    const handleEndWeightMove = (clientX) => {
        const slider = document.querySelector('.end-weight-slider');
        if (slider) {
            const rect = slider.getBoundingClientRect();
            const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const weightlbs = Math.round((newPosition / 100) * 25);

            endWeightRef.current = weightlbs;

            setEndWeightState({
                weight: weightlbs,
                sliderPosition: newPosition
            });
        }
    };

    const handleBeginningWeightMouseMove = (e) => handleBeginningWeightMove(e.clientX);
    const handleEndWeightMouseMove = (e) => handleEndWeightMove(e.clientX);

    const handleBeginningWeightTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleBeginningWeightMove(touch.clientX);
    };

    const handleEndWeightTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleEndWeightMove(touch.clientX);
    };

    const handleBeginningWeightMouseUp = () => {
        const slider = document.querySelector('.beginning-weight-slider');
        if (slider) {
            slider.removeEventListener('mousemove', handleBeginningWeightMouseMove);
        }
        document.removeEventListener('mouseup', handleBeginningWeightMouseUp);
        sendBeginningWeightData();
    };

    const handleEndWeightMouseUp = () => {
        const slider = document.querySelector('.end-weight-slider');
        if (slider) {
            slider.removeEventListener('mousemove', handleEndWeightMouseMove);
        }
        document.removeEventListener('mouseup', handleEndWeightMouseUp);
        sendEndWeightData();
    };

    const handleBeginningWeightTouchEnd = () => {
        const slider = document.querySelector('.beginning-weight-slider');
        if (slider) {
            slider.removeEventListener('touchmove', handleBeginningWeightTouchMove);
        }
        document.removeEventListener('touchend', handleBeginningWeightTouchEnd);
        sendBeginningWeightData();
    };

    const handleEndWeightTouchEnd = () => {
        const slider = document.querySelector('.end-weight-slider');
        if (slider) {
            slider.removeEventListener('touchmove', handleEndWeightTouchMove);
        }
        document.removeEventListener('touchend', handleEndWeightTouchEnd);
        sendEndWeightData();
    };

    const sendBeginningWeightData = () => {
        const Sendlbs = `b${beginningWeightRef.current}`;
        console.log(Sendlbs);
        window.serialport.writeToPort('COM15', Sendlbs)
            .then(() => {
                // console.log('Data written successfully');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const sendEndWeightData = () => {
        const Sendlbs = `e${endWeightRef.current}`;
        console.log(Sendlbs);
        window.serialport.writeToPort('COM15', Sendlbs)
            .then(() => {
                // console.log('Data written successfully');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="dropset container">
            <div className="workout-config dropset">
                <div className='dropset beginweight'>
                    <h1 className="dropset weight-text">Initial Weight</h1>
                    <div
                        className="beginning-weight-slider"
                        onMouseDown={startBeginningWeightSlide}
                        onTouchStart={startBeginningWeightSlide}
                    >
                        <div
                            className="horizontal-gradient-fill"
                            style={{ width: `${beginningWeightState.sliderPosition}%` }}
                        >
                        </div>
                    </div>
                    <h1 className="dropset pounds-text">{beginningWeightState.weight} lbs</h1>
                </div>

                <div className='dropset endweight'>
                    <h1 className="dropset weight-text">Decrement Factor</h1>
                    <div
                        className="end-weight-slider"
                        onMouseDown={startEndWeightSlide}
                        onTouchStart={startEndWeightSlide}
                    >
                        <div
                            className="horizontal-gradient-fill"
                            style={{ width: `${endWeightState.sliderPosition}%` }}
                        >
                        </div>
                    </div>
                    <h1 className="dropset pounds-text">{endWeightState.weight} lbs</h1>
                </div>

                {/* <div className="dropset SetsAndReps">
                    <div className='dropset sets'>
                        <h1 className="dropset sets-text">Sets</h1>
                        <div className="incrementor">
                            <button onClick={decrementSets}>-</button>
                            <span style={{ width: "60px" }}>{sets}</span>
                            <button onClick={incrementSets}>+</button>
                        </div>
                    </div>
                    <div className='dropset reps'>
                        <h1 className="dropset reps-text">Reps</h1>
                        <div className="incrementor">
                            <button onClick={decrementReps}>-</button>
                            <span style={{ width: "60px" }}>{reps}</span>
                            <button onClick={incrementReps}>+</button>
                        </div>
                    </div>
                </div> */}
            </div>
            <button className="config-close-button" onClick={() => {
                onApply(sets, reps, beginningWeightState.weight, endWeightState.weight);
            }}>APPLY</button>
        </div>
    );
};