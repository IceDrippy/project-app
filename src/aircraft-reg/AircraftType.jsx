import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import SingleEngine from "../assets/single-engine.jpg";
import TwinEngine from "../assets/twin-engine.jpg";
import LightJet from "../assets/light-jet.jpg";
import Helicopter from "../assets/helicopter.jpg";
import "./AircraftType.css";

export function AircraftID({ compSteps = [], addCompletedStep, updateRegistrationData }) {
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo', 'readOnly': true } } };
  const steps = [
    { number: 1, label: 'Aircraft', active: true},
    { number: 2, label: 'Use Case', active: false },
    { number: 3, label: 'Pilot', active: false  },
    { number: 4, label: 'Coverage', active: false},
    { number: 5, label: 'Quote', active: false  },
  ];
  
  const navigate = useNavigate();


  return (
    <div className="signup-container">
      
      <header className="progress-header">
        <div className="steps-wrapper">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`step-item ${step.active ? 'active-step' : ''}`}
            >
                           {compSteps.includes(step.number) ? (
                            <Checkbox
                                {...label}
                                size="small"
                                sx={{
                                color: '#1e293b',
                                '&.Mui-checked': {
                                    color:'#1e293b',
                                },
                                }}
                                checked
                            />
                            ) : (
                            <span className="step-number">{step.number}</span>
                            )}
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="sub-nav">
        <Button className="back-btn" onClick={() => navigate(-1)} variant="text" size="small">
          <span className="arrow">‹</span> Back
        </Button>
        <div className="autosave-status">
          <span className="green-dot"></span> Progress saved automatically
        </div>
      </div>

      <div className="wizard-card">

        <main className="form-content">
          <h1 className="main-title">What Aircraft are you looking to insure?</h1>
          <p className="aircraft-subtitle">Select the aircraft category that best matches the plane you want to insure.</p>

        
          <div className="aircraft-options-container">
            <button
              type="button"
              className="aircraft-card-wrapper"
              onClick={() => setSelectedAircraft("single")}
              aria-pressed={selectedAircraft === "single"}
            >
              <div className={`aircraft-card ${selectedAircraft === 'single' ? 'selected' : ''}`}>
                <img src={SingleEngine} alt="Single Engine Aircraft" className="aircraft-image" />
                <div className="aircraft-content">
                  <div className="aircraft-title-wrapper">
                    <FlightTakeoffIcon className="aircraft-icon" />
                    <h3>Single Engine</h3>
                  </div>
                  <p>Piston aircraft up to 6 seats</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="aircraft-card-wrapper"
              onClick={() => setSelectedAircraft("twin")}
              aria-pressed={selectedAircraft === "twin"}
            >
              <div className={`aircraft-card ${selectedAircraft === 'twin' ? 'selected' : ''}`}>
                <img src={TwinEngine} alt="Twin Engine Aircraft" className="aircraft-image" />
                <div className="aircraft-content">
                  <div className="aircraft-title-wrapper">
                    <AirplanemodeActiveIcon className="aircraft-icon" />
                    <h3>Twin Engine</h3>
                  </div>
                  <p>Piston aircraft up to 6+ seats</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="aircraft-card-wrapper"
              onClick={() => setSelectedAircraft("jet")}
              aria-pressed={selectedAircraft === "jet"}
            >
              <div className={`aircraft-card ${selectedAircraft === 'jet' ? 'selected' : ''}`}>
                <img src={LightJet} alt="Light Jet" className="aircraft-image" />
                <div className="aircraft-content">
                  <div className="aircraft-title-wrapper">
                    <AirplanemodeActiveIcon className="aircraft-icon" />
                    <h3>Light Jet</h3>
                  </div>
                  <p>Very Light Jets(VLJ) to Light Jets</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="aircraft-card-wrapper"
              onClick={() => setSelectedAircraft("helicopter")}
              aria-pressed={selectedAircraft === "helicopter"}
            >
              <div className={`aircraft-card ${selectedAircraft === 'helicopter' ? 'selected' : ''}`}>
                <img src={Helicopter} alt="Helicopter" className="aircraft-image" />
                <div className="aircraft-content">
                  <div className="aircraft-title-wrapper">
                    <FlightTakeoffIcon className="aircraft-icon" />
                    <h3>Helicopter</h3>
                  </div>
                  <p>Private and commercial helicopters</p>
                </div>
              </div>
            </button>

          </div>

        
        </main>

            <footer className="action-footer">
        <Button
          className="submit-btn"
          variant="contained"
          sx={{
            backgroundColor: "#1b263b",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#151e2e",
            },
          }}
          onClick={() => {
            if (selectedAircraft) {
              updateRegistrationData?.({ aircraft_type: selectedAircraft });
              addCompletedStep?.(1);
              navigate("/manual");
            }
          }}
          disabled={!selectedAircraft}
        >
          Continue
        </Button>
      </footer>
      </div>

    </div>
  );
}
