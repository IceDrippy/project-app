import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Registration Wizard Components
import { AircraftID } from "./aircraft-reg/AircraftType";
import { UseCase } from "./aircraft-reg/UseCase";
import { ManualSignUp } from "./aircraft-reg/ManualAircraft-Search";
import { Pilot } from "./aircraft-reg/Pilot";
import { Coverage } from "./aircraft-reg/Coverage";
import { Quote } from "./aircraft-reg/Quote";
import { Payment } from "./aircraft-reg/Payment";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import FileClaim from "./pages/FileClaim";
import ClaimReview from "./pages/ClaimReview";
import Aircrafts from "./pages/Aircrafts";
import Plans from "./pages/Plans";
import CurrentPlan from "./pages/PlanComparison";
import MyPolicies from "./pages/MyPolicies";
import Admin from "./pages/Admin";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";

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

  const resetRegistrationFlow = useCallback(() => {
    setCompleted([]);
    setRegistrationData(defaultRegistrationData);
  }, []);

  const updateRegistrationData = useCallback((updates) => {
    setRegistrationData((current) => ({ ...current, ...updates }));
  }, []);

  const addCompletedStep = useCallback((completedStep) => {
    setCompleted((steps) =>
      steps.includes(completedStep) ? steps : [...steps, completedStep]
    );
  }, []);

  const addAircraft = useCallback((aircraft) => {
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
  }, [registrationData.pilotCert, registrationData.medicalStatus]);

  const resolveQueueItem = useCallback(({ source, id, status, entry }) => {
    const apply = (list) =>
      list.map((item) => (item.id === id ? { ...item, status } : item));

    if (source === "aircraft") setAircrafts(apply);
    else if (source === "claim") setClaims(apply);
    else setReviewItems(apply);

    setReviewLog((current) => [entry, ...current]);
  }, []);

  const clearReviewLog = useCallback(() => setReviewLog([]), []);

  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-signup" element={<SignUp />} />

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
          element={
            <UseCase
              compSteps={completed}
              addCompletedStep={addCompletedStep}
              registrationData={registrationData}
              updateRegistrationData={updateRegistrationData}
            />
          }
        />
        <Route
          path="/pilot"
          element={
            <Pilot
              compSteps={completed}
              addCompletedStep={addCompletedStep}
              registrationData={registrationData}
              updateRegistrationData={updateRegistrationData}
            />
          }
        />
        <Route
          path="/coverage"
          element={
            <Coverage
              compSteps={completed}
              addCompletedStep={addCompletedStep}
              registrationData={registrationData}
              updateRegistrationData={updateRegistrationData}
            />
          }
        />
        <Route
          path="/quote"
          element={
            <Quote
              compSteps={completed}
              addCompletedStep={addCompletedStep}
              registrationData={registrationData}
              updateRegistrationData={updateRegistrationData}
              resetRegistrationFlow={resetRegistrationFlow}
            />
          }
        />
        <Route
          path="/manual"
          element={
            <ManualSignUp
              compSteps={completed}
              registrationData={registrationData}
              updateRegistrationData={updateRegistrationData}
            />
          }
        />
        <Route
          path="/payment"
          element={
            <Payment
              compSteps={completed}
              registrationData={registrationData}
              addAircraft={addAircraft}
              resetRegistrationFlow={resetRegistrationFlow}
            />
          }
        />

        <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/aircrafts" element={<Aircrafts />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/file-claim" element={<FileClaim />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/my-policies" element={<MyPolicies />} />
        <Route path="/plan-compare" element={<CurrentPlan />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
}