import { Routes, Route } from "react-router-dom";
import { AircraftID } from "./aircraft-reg/AircraftType";
import { UseCase } from "./aircraft-reg/UseCase";
import { ManualSignUp } from "./aircraft-reg/ManualAircraft-Search";
import { Pilot } from "./aircraft-reg/Pilot";
import { Coverage } from "./aircraft-reg/Coverage";
import { Quote } from "./aircraft-reg/Quote";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import { Login } from "./pages/Login";
import { useState } from "react";
import { SignUp } from "./pages/SignUp";
import Plans from "./pages/Plans";
import Aircrafts from "./pages/Aircrafts";
import FileClaim from "./pages/FileClaim";
import MyPolicies from "./pages/MyPolicies";
import CurrentPlan from "./pages/PlanComparison";
import Admin from "./pages/Admin";
import ClaimReview from "./pages/ClaimReview";
import {Payment} from "./aircraft-reg/Payment";

let referenceCounter = 1000;
const sequence = () => `2026-${String(++referenceCounter)}`;

const defaultRegistrationData = {
  aircraftType: "",
  year: "",
  make: "",
  model: "",
  engineType: "",
  serialNum: "",
  flightPurpose: "",
  storage: "",
  homeBase: "",
  pilotCert: "PPL License",
  medicalStatus: "First Class - Active",
  hours: {
    total: "",
    retractable: "",
    multiEngine: "",
    makeModel: "",
  },
  hullValue: 450000,
  selectedTier: "professional",
};

export default function App() {
  const [completed, setCompleted] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [claims, setClaims] = useState([]);
  const [reviewItems, setReviewItems] = useState([]);
  const [reviewLog, setReviewLog] = useState([]);
  const [registrationData, setRegistrationData] = useState(defaultRegistrationData);

  const resetRegistrationFlow = () => {
    setCompleted([]);
    setRegistrationData(defaultRegistrationData);
  };

  const updateRegistrationData = (updates) => {
    setRegistrationData((current) => ({ ...current, ...updates }));
  };

  const addCompletedStep = (completedStep) => {
    setCompleted((steps) =>
      steps.includes(completedStep) ? steps : [...steps, completedStep]
    );
  };

  // Registering an aircraft also opens the pilot document and medical review tasks.
  const addAircraft = (aircraft) => {
    const reference = sequence();
    const pilot = localStorage.getItem("fullname") || "Registered pilot";

    setAircrafts((current) => [
      ...current,
      {
        ...aircraft,
        id: crypto.randomUUID(),
        reference: `APP-${reference}`,
        pilot,
        status: "Pending",
        submittedAt: Date.now(),
      },
    ]);

    setReviewItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        reference: `DOC-${reference}`,
        kind: "Document",
        detail: registrationData.pilotCert,
        aircraft: aircraft.name,
        pilot,
        status: "Pending",
        submittedAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        reference: `MED-${reference}`,
        kind: "Medical",
        detail: registrationData.medicalStatus,
        aircraft: aircraft.name,
        pilot,
        status: "Pending",
        submittedAt: Date.now(),
      },
    ]);
  };

  const addClaim = (claim) => {
    setClaims((current) => [
      ...current,
      {
        ...claim,
        id: crypto.randomUUID(),
        reference: `CLM-${sequence()}`,
        pilot: localStorage.getItem("fullname") || "Registered pilot",
        status: "Pending",
        submittedAt: Date.now(),
      },
    ]);
  };

  const resolveQueueItem = ({ source, id, status, entry }) => {
    const apply = (list) =>
      list.map((item) => (item.id === id ? { ...item, status } : item));

    if (source === "aircraft") setAircrafts(apply);
    else if (source === "claim") setClaims(apply);
    else setReviewItems(apply);

    setReviewLog((current) => [entry, ...current]);
  };

  const clearReviewLog = () => setReviewLog([]);

  return (
    <main className="App">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/user-signup"
          element={<SignUp/>}
        />

        <Route
          path="/aircraft"
          element={
              <AircraftID
              compSteps={completed}
              addCompletedStep={addCompletedStep}
              aircraftData={registrationData}
              updateRegistrationData={updateRegistrationData}
            />
          }
        />
        <Route
          path="/use-case"
          element={<UseCase compSteps={completed} addCompletedStep={addCompletedStep} registrationData={registrationData} updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/pilot"
          element={<Pilot compSteps={completed} addCompletedStep={addCompletedStep} registrationData={registrationData} updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/coverage"
          element={<Coverage compSteps={completed} addCompletedStep={addCompletedStep} registrationData={registrationData} updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/quote"
          element={<Quote compSteps={completed} addCompletedStep={addCompletedStep} registrationData={registrationData} updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/manual"
          element={<ManualSignUp compSteps={completed} registrationData={registrationData} updateRegistrationData={updateRegistrationData} />}
        />

        <Route path="/payment" element={<Payment compSteps={completed} addCompletedStep={addCompletedStep} registrationData={registrationData} addAircraft={addAircraft} resetRegistrationFlow={resetRegistrationFlow}/>} />
        <Route path="/dashboard" element={<Dashboard aircrafts={aircrafts} claims={claims} />} />
        <Route
          path="/admin"
          element={
            <Admin
              aircrafts={aircrafts}
              claims={claims}
              reviewItems={reviewItems}
              reviewLog={reviewLog}
              resolveQueueItem={resolveQueueItem}
              clearReviewLog={clearReviewLog}
            />
          }
        />
        <Route
          path="/admin/claims/:claimId"
          element={<ClaimReview claims={claims} resolveQueueItem={resolveQueueItem} />}
        />
        <Route path="/aircrafts" element={<Aircrafts aircrafts={aircrafts} />} />
        <Route path="/claims" element={<Claims claims={claims} />} />
        <Route path="/file-claim" element={<FileClaim aircrafts={aircrafts} addClaim={addClaim} />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/my-policies" element={<MyPolicies aircrafts={aircrafts} />} />
        <Route path="/plan-compare" element={<CurrentPlan />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
}