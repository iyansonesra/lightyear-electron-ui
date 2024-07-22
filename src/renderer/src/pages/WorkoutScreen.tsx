/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '../styles/WorkoutScreen.css'
import full_machine from '../assets/full_machine.png'
import bottom_machine from '../assets/bottom_machine.png'
import { IoSettingsOutline } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
import { IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useUser } from './UserContext'
import { RxPerson } from 'react-icons/rx'
import { LoadingEccentricConfig } from '../components/LoadingEccentricConfig'
import { DropsetConfig } from '../components/DropsetConfig'
import { StandardConfig } from '../components/StandardConfig'

window.serialport
  .openPort('COM15', 57600)
  .then(() => {
    console.log('Data written successfully')
  })
  .catch((error) => {
    console.error('Error:', error)
  })

export const WorkoutScreen = ({ setIsAuthorized, setIsGuestUser }) => {
  const CIRCLE_LENGTH1 = 500
  const R1 = CIRCLE_LENGTH1 / (2 * Math.PI)
  const CIRCLE_LENGTH2 = 550
  const R2 = CIRCLE_LENGTH2 / (2 * Math.PI)
  const [repsCompletion, setRepsCompletion] = useState(0)
  const [setsCompletion, setSetsCompletion] = useState(0)
  const { firstName, lastName } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [numSets, setNumSets] = useState(4)
  const [numReps, setNumReps] = useState(8)
  const [currentRep, setCurrentRep] = useState(0)
  const [currentSet, setCurrentSet] = useState(0)
  // const [beginningWeight, setBeginningWeight] = useState(50);
  const [isCleanScreenActive, setIsCleanScreenActive] = useState(false);

  // const [initialWeight, setInitialWeight] = useState(50);
  const [workoutMode, setWorkoutMode] = useState('Standard')
  const [endWeight, setEndWeight] = useState(0)
  const [concentricWeight, setConcentricWeight] = useState(50)
  const [eccentricWeight, setEccentricWeight] = useState(70)
  const [angle, setAngle] = useState(0)
  const [isAscending, setIsAscending] = useState(true)
  const [hasReachedUpperThreshold, setHasReachedUpperThreshold] = useState(false)
  const BOTTOM_THRESHOLD = 20 // Set this to your desired value
  const UPPER_THRESHOLD = 75 // Set this to your desired value
  const [ballPosition, setBallPosition] = useState(710)
  const [isHeightSliderVisible, setIsHeightSliderVisible] = useState(false);
  const [currentTargetWeight, setCurrentTargetWeight] = useState(concentricWeight);
  const lastSignificantAngle = useRef(0);
  const animationFrameId = useRef(null);
  const ANGLE_THRESHOLD = 10; // Minimum angle change to trigger an update
  const LERP_FACTOR = 0.07;

  const [workoutType, setWorkoutType] = useState('Standard')

  useEffect(() => {
    window.serialport.listenForAngle('COM15', (newAngle) => {
      setAngle((prevAngle) => {
        const clampedAngle = Math.max(0, Math.min(100, newAngle));
        setIsAscending(clampedAngle > prevAngle);

        // Only update if the angle change is significant
        if (Math.abs(clampedAngle - lastSignificantAngle.current) >= ANGLE_THRESHOLD) {
          lastSignificantAngle.current = clampedAngle;
          updateBallPosition(clampedAngle);
        }

        return clampedAngle;
      });
    });

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  useEffect(() => {
    // console.log(
    //   `Angle: ${angle}, Ascending: ${isAscending}, Upper Threshold Reached: ${hasReachedUpperThreshold}`
    // )
  }, [angle, isAscending, hasReachedUpperThreshold])

  const ballStyle = {
    width: '40px',
    height: '40px',
    background: '-webkit-linear-gradient(45deg, #000, #fff)',
    borderRadius: '50%',
    position: 'absolute',
    top: `${ballPosition}px`,
    // Remove the transition property to allow for smoother animation
  };

  const updateBallPosition = (angle) => {
    const lineHeight = 710; // Height of the line in pixels
    const minAngle = 20;
    const maxAngle = 80;

    // Normalize the angle to the range 0-1
    const normalizedAngle = (angle - minAngle) / (maxAngle - minAngle);

    // Calculate the target position, ensuring it stays within the container
    const targetPosition = lineHeight - Math.max(0, Math.min(1, normalizedAngle)) * lineHeight;

    const animateBallPosition = () => {
      setBallPosition((currentPosition) => {
        const newPosition = currentPosition + (targetPosition - currentPosition) * LERP_FACTOR;

        if (Math.abs(newPosition - targetPosition) < 0.1) {
          return targetPosition;
        }

        animationFrameId.current = requestAnimationFrame(animateBallPosition);
        return newPosition;
      });
    };

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(animateBallPosition);
  };


  const updateSlider = (weight) => {
    setSliderState({
      weight: weight,
      sliderPosition: (weight / 300) * 100
    })
  }

  useEffect(() => {
    if (workoutMode === 'LoadingEccentric') {
      if (!hasReachedUpperThreshold) {

      } else if (hasReachedUpperThreshold) {

        // gradualWeightChange(concentricWeight, eccentricWeight)
      }
    }

    if (isAscending && angle >= UPPER_THRESHOLD) {
      setHasReachedUpperThreshold(true)
      if (workoutMode === 'LoadingEccentric') {
        sendWeightData(eccentricWeight)
        updateSlider(eccentricWeight)
      }

    } else if (!isAscending && hasReachedUpperThreshold && angle <= BOTTOM_THRESHOLD) {
      incrementRep()
      if (workoutMode === 'LoadingEccentric') {
        sendWeightData(concentricWeight)
        updateSlider(concentricWeight)
      }
      setHasReachedUpperThreshold(false)
      // if (workoutMode === 'LoadingEccentric') {
      //   gradualWeightChange(eccentricWeight, concentricWeight)
      // }
    }
  }, [angle, isAscending, workoutMode])

  const incrementRep = () => {
    if (
      workoutMode === 'cool' ||
      endWeight === 0 ||
      concentricWeight === 0 ||
      eccentricWeight === 0 ||
      horizontalSliderState.weight
    ) {
    }

    if (workoutMode === 'LoadingEccentric') {
      sendWeightData(concentricWeight)
      updateSlider(concentricWeight)
    }

    if (currentRep < numReps) {
      setCurrentRep((prev) => prev + 1)
      if (currentRep === numReps - 1) {
        setTimeout(() => {
          setCurrentRep(0)
          incrementSet()
        }, 1000)
      }
    } else {
      setTimeout(() => {
        setCurrentRep(0)
      }, 1000)
    }
    incrementrepsCompletion()
  }
  const incrementSet = () => {
    if (currentSet < numSets) {
      setCurrentSet((prev) => prev + 1)
      if (currentSet == numSets - 1) {
        setTimeout(() => {
          setCurrentSet(0)
          setCurrentRep(0)
        }, 1000)
      }
    }
    incrementsetsCompletion()
  }

  const navigate = useNavigate()

  const handleConfigureClick = (e) => {
    e.stopPropagation()
    setIsConfigOpen(true)
  }

  const closeConfig = () => {
    setIsConfigOpen(false)
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    setIsGuestUser(false)
    navigate('/')
  }

  const incrementsetsCompletion = () => {
    setSetsCompletion((prev) => (prev == numSets ? 0 : Math.min(numSets, prev + 1)))
    setTimeout(() => {
      setSetsCompletion((prev) => (prev == numSets ? 0 : prev))
    }, 1000)
  }

  const incrementrepsCompletion = () => {
    setRepsCompletion((prev) => (prev == numReps ? 0 : Math.min(numReps, prev + 1)))

    setTimeout(() => {
      setRepsCompletion((prev) => (prev == numReps ? 0 : prev))
    }, 1000)
  }

  const resetCompletion = () => {
    setSetsCompletion(0)
    setRepsCompletion(0)
    setCurrentRep(0)
    setCurrentSet(0)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [sliderState, setSliderState] = useState({
    weight: 150,
    sliderPosition: (50 / 300) * 300
  })

  const [heightState, setheightState] = useState({
    height: 5,
    heightPosition: (50 / 10) * 10
  })

  const weightRef = useRef(50) // Initialize with default value

  const handleMouseDown = (e) => {
    e.preventDefault()
    if (e.type === 'mousedown') {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }
  }

  const handleMove = (clientY) => {
    const slider = document.querySelector('.weight-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(100, ((rect.bottom - clientY) / rect.height) * 100))
      const weightlbs = Math.round((newPosition / 100) * 300)

      weightRef.current = weightlbs // Update ref immediately

      setSliderState({
        weight: weightlbs,
        sliderPosition: newPosition
      })
    } else {
      console.error('Slider element not found.')
    }
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    sendWeightData()
  }

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    sendWeightData()
  }

  const sendWeightData = (weight?: number) => {
    let weightToSend
    if (workoutMode === 'LoadingEccentric') {
      weightToSend = weight ?? (isAscending ? concentricWeight : eccentricWeight)
    } else {
      weightToSend = weight ?? weightRef.current
    }
    const Sendlbs = `b${weightToSend}`
    console.log(Sendlbs)
    window.serialport
      .writeToPort('COM15', Sendlbs)
      .then(() => {
        // console.log('Data written successfully');
        updateSlider(weightToSend)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const heightRef = useRef(5) // Initialize with default value

  const handleMouseDownHeight = (e) => {
    e.preventDefault()
    if (e.type === 'mousedown') {
      document.addEventListener('mousemove', handleMouseMoveHeight)
      document.addEventListener('mouseup', handleMouseUpHeight)
    } else if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleTouchMoveHeight)
      document.addEventListener('touchend', handleTouchEndHeight)
    }
  }

  const handleMoveHeight = (clientY) => {
    const slider = document.querySelector('.inches-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(100, ((rect.bottom - clientY) / rect.height) * 100))
      const seat = Math.round((newPosition / 100) * 10)

      heightRef.current = seat // Update ref immediately

      setheightState({
        height: seat,
        heightPosition: newPosition
      })
    } else {
      console.error('Slider element not found.')
    }
  }

  const handleMouseUpHeight = () => {
    document.removeEventListener('mousemove', handleMouseMoveHeight)
    document.removeEventListener('mouseup', handleMouseUpHeight)
    sendHeightData()
  }

  const handleTouchEndHeight = () => {
    document.removeEventListener('touchmove', handleTouchMoveHeight)
    document.removeEventListener('touchend', handleTouchEndHeight)
    sendHeightData()
  }

  const sendHeightData = () => {
    const Sendseat = `a${heightRef.current}`
    console.log(Sendseat)
    window.serialport
      .writeToPort('COM15', Sendseat)
      .then(() => {
        // console.log('Data written successfully');
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const horizontalWeightRef = useRef(50) // Initialize with default value

  const updateHorizontalSlider = (e) => {
    updateHorizontalPosition(e.clientX)
  }

  const updateHorizontalSliderTouch = (e) => {
    const touch = e.touches[0]
    updateHorizontalPosition(touch.clientX)
  }

  const updateHorizontalPosition = (clientX) => {
    const slider = document.querySelector('.horizontal-weight-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const weightlbs = Math.round((newPosition / 100) * 300)

      horizontalWeightRef.current = weightlbs // Update ref immediately

      setHorizontalSliderState({
        weight: weightlbs,
        sliderPosition: newPosition
      })
    } else {
      console.error('Horizontal slider element not found.')
    }
  }

  const CleanScreenOverlay = ({ onClose }) => {
    const [pressing, setPressing] = useState(false);
    const pressTimer = useRef(null);
  
    const startPressing = () => {
      setPressing(true);
      pressTimer.current = setTimeout(() => {
        onClose();
      }, 2000);
    };
  
    const stopPressing = () => {
      setPressing(false);
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  
    return (
      <div className="clean-screen-overlay">
        <button 
          className="clean-screen-close" 
          onMouseDown={startPressing}
          onMouseUp={stopPressing}
          onMouseLeave={stopPressing}
          onTouchStart={startPressing}
          onTouchEnd={stopPressing}
        >
          <h1>{pressing ? "Keep holding to exit..." : "Hold to exit Clean Screen Mode"}</h1>
        </button>
      </div>
    );
  };

  const endHorizontalSlide = () => {
    document.removeEventListener('mousemove', updateHorizontalSlider)
    document.removeEventListener('touchmove', updateHorizontalSliderTouch)
    document.removeEventListener('mouseup', endHorizontalSlide)
    document.removeEventListener('touchend', endHorizontalSlide)
    sendHorizontalWeightData()
  }

  const sendHorizontalWeightData = () => {
    const Sendlbs = `b${horizontalWeightRef.current}`
    console.log(Sendlbs)
    window.serialport
      .writeToPort('COM15', Sendlbs)
      .then(() => {
        // console.log('Data written successfully');
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    handleMove(touch.clientY)
  }

  const handleMouseMove = (e) => {
    handleMove(e.clientY)
  }

  const handleMouseMoveHeight = (e) => {
    handleMoveHeight(e.clientY)
  }

  const handleTouchMoveHeight = (e) => {
    const touch = e.touches[0]
    handleMoveHeight(touch.clientY)
  }

  const [horizontalSliderState, setHorizontalSliderState] = useState({
    weight: 50,
    sliderPosition: (50 / 300) * 100 // Changed to percentage
  })

  const DateTime = () => {
    const [date, setDate] = useState(new Date())

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date()
        now.setSeconds(0, 0)
        setDate(now)
      }, 1000)

      const initialDate = new Date()
      initialDate.setSeconds(0, 0)
      setDate(initialDate)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="time">
        <p>{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
      </div>
    )
  }

  return (
    <div className="root">
      <div className="header">
        <IoMenuOutline size={40} className="menu-icon" onClick={toggleMenu} />
        <h1 className="header-text">PREACHER CURL</h1>
        <div className="right-header">
          <DateTime></DateTime>
          <IoSettingsOutline size={35} className="settings-icon" />
        </div>
      </div>

      <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}>
        <div className="close-circle">
          <IoCloseOutline size={26} className="close-icon" color="white" onClick={toggleMenu} />
        </div>
        <div className="user-info">
          <RxPerson size={45} className="user-icon" />

          <h1>
            {firstName} {lastName}
          </h1>
        </div>

        <div className="menuItem" onClick={() => setIsCleanScreenActive(true)}>
          <h1 className="menu-text">Clean Screen Mode</h1>
        </div>
        <div className="logoutArea" onClick={handleLogout}>
          <h1 className="logout-text">LOGOUT</h1>
          <IoLogOutOutline size={35} className="logout-icon" />
        </div>
      </div>


      <div className="workout-container">
        <div className="currWorkout">
          <div className="workout-rectangle">
            <h1 className="workout-text">CURRENT WORKOUT</h1>

            <div className="stats-circle-container">
              <div className="sets-circle-container">
                <h1 className="sets-text">SETS</h1>
                <div className="set-rep-text">
                  <h1 className="setNumber">{currentSet}</h1>
                  <h1 className="setNumberSmaller">/{numSets}</h1>
                </div>

                <svg width="250" height="250" viewBox="-10 0 200 200">
                  <defs>
                    <linearGradient id="circleGradient" x1="100%" y1="150%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R1}
                    stroke="#E3DDDD"
                    strokeWidth={20}
                    fill="none"
                  />
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R2 - 8}
                    stroke="url(#circleGradient)"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={CIRCLE_LENGTH1}
                    strokeDashoffset={CIRCLE_LENGTH1 * (1 - setsCompletion / numSets)}
                  />
                </svg>
              </div>

              <div className="reps-circle-container">
                <h1 className="reps-text">REPS</h1>
                <div className="set-sets-text">
                  <h1 className="setNumber">{currentRep}</h1>
                  <h1 className="setNumberSmaller">/{numReps}</h1>
                </div>
                <svg width="250" height="250" viewBox="-10 0 200 200">
                  <defs>
                    <linearGradient id="circleGradient" x1="100%" y1="150%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R1}
                    stroke="#E3DDDD"
                    strokeWidth={20}
                    fill="none"
                  />
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R2 - 8}
                    stroke="url(#circleGradient)"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={CIRCLE_LENGTH1}
                    strokeDashoffset={CIRCLE_LENGTH1 * (1 - repsCompletion / numReps)}
                  />
                </svg>
              </div>
            </div>

            <button className="configure-button" onClick={handleConfigureClick}>
              CONFIGURE
            </button>

            {/* <button onClick={incrementCompletion} className="increment-button">Increment Completion</button> */}
            <button onClick={incrementRep} className="increment-button">
              Increment Rep
            </button>
            <button onClick={resetCompletion} className="reset-button">
              RESET
            </button>
          </div>
        </div>

        <div className="model-container">
          <div className="model">
            <img src={full_machine} alt="full_machine" className="full-machine" />
            <img src={bottom_machine} alt="full_machine" className="bottom-machine" />
          </div>
          <div className="horizontal-line"></div>
          <button
            className="height-slider-toggle"
            onClick={() => setIsHeightSliderVisible(!isHeightSliderVisible)}
          >
            {isHeightSliderVisible ? "Hide Seat Height" : "Adjust Seat Height"}
          </button>
        </div>

        <div className="sliders">
          <div className="skeuContainer">
            <div className="line">
              <div style={ballStyle as React.CSSProperties}></div>
            </div>
          </div>

          <div className="weight-slider-container">
            <h1 className="weight-text">WEIGHT</h1>
            <h1 className="pounds-text">{sliderState.weight} lbs</h1>
            <div
              className="weight-slider"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div
                className="gradient-fill"
                style={{ height: `${sliderState.sliderPosition}%` }}
              ></div>
            </div>
          </div>

        </div>

        {isHeightSliderVisible && (
          <div className="height-slider-container fade-in">
            <h1 className="height-text">HEIGHT</h1>
            <h1 className="inches-text">{heightState.height}"</h1>
            <div
              className="inches-slider"
              onMouseDown={handleMouseDownHeight}
              onTouchStart={handleMouseDownHeight}
            >
              <div
                className="height-gradient-fill"
                style={{ height: `${heightState.heightPosition}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className={`overlay ${isConfigOpen ? 'active' : ''}`} onClick={closeConfig}></div>
      <div className={`config-screen ${isConfigOpen ? 'open' : ''}`}>
        <h1 className="header-text">WORKOUT CONFIGURATION</h1>
        <div className="workout-type-selector">
          <div
            className={`option ${workoutType === 'Standard' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Standard')}
          >
            Standard
          </div>
          <div
            className={`option ${workoutType === 'Loading Eccentric' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Loading Eccentric')}
          >
            Loading Eccentric
          </div>
          <div
            className={`option ${workoutType === 'Dropset' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Dropset')}
          >
            Dropset
          </div>
          <div className="selector"></div>
        </div>

        {workoutType === 'Standard' && (
          <StandardConfig
            onApply={(newSets: number, newReps: number, newWeight: number) => {
              setNumSets(newSets)
              setNumReps(newReps)
              setSliderState({
                weight: newWeight,
                sliderPosition: (newWeight / 300) * 100
              })
              weightRef.current = newWeight
              sendWeightData(newWeight)
              setWorkoutMode('Standard')
              closeConfig()
            }}
          />
        )}

        {workoutType === 'Dropset' && (
          <DropsetConfig
            onApply={(newSets, newReps, newBeginningWeight, newEndWeight) => {
              setNumSets(newSets)
              setNumReps(newReps)
              setSliderState({
                weight: newBeginningWeight,
                sliderPosition: (newBeginningWeight / 300) * 100
              })
              setEndWeight(newEndWeight)
              weightRef.current = newBeginningWeight
              sendWeightData(newBeginningWeight)
              setWorkoutMode('Dropset')
              closeConfig()
            }}
          />
        )}
        {workoutType === 'Loading Eccentric' && (
          <LoadingEccentricConfig
            onApply={(newSets, newReps, newConcentricWeight, newEccentricWeight) => {
              setNumSets(newSets)
              setNumReps(newReps)
              setConcentricWeight(newConcentricWeight)
              setEccentricWeight(newEccentricWeight)
              // Update the main weight slider with concentric weight
              setSliderState({
                weight: newConcentricWeight,
                sliderPosition: (newConcentricWeight / 300) * 100
              })
              // Update the weightRef
              weightRef.current = newConcentricWeight
              // Send the new weight data to the serial port
              sendWeightData(newConcentricWeight)
              setWorkoutMode('LoadingEccentric')
              closeConfig()
            }}
          />
        )}
      </div>
      {isCleanScreenActive && (
        <CleanScreenOverlay onClose={() => setIsCleanScreenActive(false)} />
      )}
    </div>
  )
}
