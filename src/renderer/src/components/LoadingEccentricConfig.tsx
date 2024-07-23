import { useState, useRef } from 'react';

  export const LoadingEccentricConfig = ({ onApply }) => {
    const [sets, setSets] = useState(4);
    const [reps, setReps] = useState(8);
    const [horizontalSliderConState, setHorizontalConSliderState] = useState({
        weight: 50,
        sliderPosition: (50 / 300) * 100
    });
    const [horizontalSliderEccState, setHorizontalEccSliderState] = useState({
        weight: 70,
        sliderPosition: (70 / 300) * 100
    });

    const concentricWeightRef = useRef(50);
    const eccentricWeightRef = useRef(70);

    const incrementSets = () => setSets(prev => Math.min(prev + 1, 9));
    const decrementSets = () => setSets(prev => Math.max(1, prev - 1));
    const incrementReps = () => setReps(prev => Math.min(prev + 1, 30));
    const decrementReps = () => setReps(prev => Math.max(1, prev - 1));

    const startConcentricSlide = (e) => {
        e.preventDefault();
        const slider = e.currentTarget;
        if (e.type === 'mousedown') {
            // slider.addEventListener('mousemove', handleConcentricMouseMove);
            document.addEventListener('mouseup', handleConcentricMouseUp);
        } else if (e.type === 'touchstart') {
            slider.addEventListener('touchmove', handleConcentricTouchMove);
            document.addEventListener('touchend', handleConcentricTouchEnd);
        }
    };

    const startEccentricSlide = (e) => {
        e.preventDefault();
        const slider = e.currentTarget;
        if (e.type === 'mousedown') {
            slider.addEventListener('mousemove', handleEccentricMouseMove);
            document.addEventListener('mouseup', handleEccentricMouseUp);
        } else if (e.type === 'touchstart') {
            slider.addEventListener('touchmove', handleEccentricTouchMove);
            document.addEventListener('touchend', handleEccentricTouchEnd);
        }
    };

    const handleConcentricMouseUp = () => {
        const slider = document.querySelector('.concentric-weight-slider');
        if (slider) {
            // slider.removeEventListener('mousemove', handleConcentricMouseMove);
        }
        document.removeEventListener('mouseup', handleConcentricMouseUp);
        sendConcentricWeightData();
    };

    const handleEccentricMouseUp = () => {
        const slider = document.querySelector('.eccentric-weight-slider');
        if (slider) {
            slider.removeEventListener('mousemove', handleEccentricMouseMove);
        }
        document.removeEventListener('mouseup', handleEccentricMouseUp);
        sendEccentricWeightData();
    };

    const handleConcentricTouchEnd = () => {
        const slider = document.querySelector('.concentric-weight-slider');
        if (slider) {
            slider.removeEventListener('touchmove', handleConcentricTouchMove);
        }
        document.removeEventListener('touchend', handleConcentricTouchEnd);
        sendConcentricWeightData();
    };

    const handleEccentricTouchEnd = () => {
        const slider = document.querySelector('.eccentric-weight-slider');
        if (slider) {
            slider.removeEventListener('touchmove', handleEccentricTouchMove);
        }
        document.removeEventListener('touchend', handleEccentricTouchEnd);
        sendEccentricWeightData();
    };

    const handleConcentricMove = (clientX) => {
        const slider = document.querySelector('.concentric-weight-slider');
        if (slider) {
            const rect = slider.getBoundingClientRect();
            const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const weightlbs = Math.round((newPosition / 100) * 300);

            concentricWeightRef.current = weightlbs;

            setHorizontalConSliderState({
                weight: weightlbs,
                sliderPosition: newPosition
            });
        }
    };

    const handleEccentricMove = (clientX) => {
        const slider = document.querySelector('.eccentric-weight-slider');
        if (slider) {
            const rect = slider.getBoundingClientRect();
            const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const weightlbs = Math.round((newPosition / 100) * 300);

            eccentricWeightRef.current = weightlbs;

            setHorizontalEccSliderState({
                weight: weightlbs,
                sliderPosition: newPosition
            });
        }
    };



    const handleEccentricMouseMove = (e) => {
        handleEccentricMove(e.clientX);
    };

    const handleConcentricTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleConcentricMove(touch.clientX);
    };

    const handleEccentricTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleEccentricMove(touch.clientX);
    };

    const sendConcentricWeightData = () => {
        const Sendlbs = `c${concentricWeightRef.current}`;
        console.log(Sendlbs);
        window.serialport.writeToPort('COM15', Sendlbs)
            .then(() => {
                // console.log('Data written successfully');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const sendEccentricWeightData = () => {
        const Sendlbs = `e${eccentricWeightRef.current}`;
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
        <div className="loading-eccentric container">
            <div className="workout-config loading-eccentric">
                <div className='loading-eccentric conweight'>
                    <h1 className="loading-eccentric weight-text">Concentric Weight</h1>
                    <div
                        className="concentric-weight-slider"
                        onMouseDown={startConcentricSlide}
                        onTouchStart={startConcentricSlide}
                    >
                        <div
                            className="horizontal-gradient-fill"
                            style={{ width: `${horizontalSliderConState.sliderPosition}%` }}
                        >
                        </div>
                    </div>
                    <h1 className="loading-eccentric pounds-text">{horizontalSliderConState.weight} lbs</h1>
                </div>

                <div className='loading-eccentric eccweight'>
                    <h1 className="loading-eccentric weight-text">Eccentric Weight</h1>
                    <div
                        className="eccentric-weight-slider"
                        onMouseDown={startEccentricSlide}
                        onTouchStart={startEccentricSlide}
                    >
                        <div
                            className="horizontal-gradient-fill"
                            style={{ width: `${horizontalSliderEccState.sliderPosition}%` }}
                        >
                        </div>
                    </div>
                    <h1 className="loading-eccentric pounds-text">{horizontalSliderEccState.weight} lbs</h1>
                </div>

                <div className="loading-eccentric SetsAndReps">
                    <div className='loading-eccentric sets'>
                        <h1 className="loading-eccentric sets-text">Sets</h1>
                        <div className="incrementor">
                            <button onClick={decrementSets}>-</button>
                            <span style={{ width: "60px" }}>{sets}</span>
                            <button onClick={incrementSets}>+</button>
                        </div>
                    </div>
                    <div className='loading-eccentric reps'>
                        <h1 className="loading-eccentric reps-text">Reps</h1>
                        <div className="incrementor">
                            <button onClick={decrementReps}>-</button>
                            <span style={{ width: "60px" }}>{reps}</span>
                            <button onClick={incrementReps}>+</button>
                        </div>
                    </div>
                </div>

            </div>
            <button className="config-close-button" onClick={() => {
                onApply(sets, reps, horizontalSliderConState.weight, horizontalSliderEccState.weight);
            }}>APPLY</button>
        </div>
    );
};