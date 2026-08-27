export function Register(registrationData) {
  return {
    aircraft_type: registrationData.aircraft_type || registrationData.aircraftType,
    make: registrationData.make,
    model: registrationData.model,
    year: registrationData.year,
    engine_type: registrationData.engineType,
    serial_number: registrationData.serialNum,
    flight_purpose: registrationData.flight_purpose,
    storage_location: registrationData.storage_location,
    home_base: registrationData.home_base,
    pilot_certification: registrationData.pilotCert,
    medical_status: registrationData.medicalStatus,
    total_flight_hours: Number(registrationData.hours?.total) || 0,
    hull_value: registrationData.hullValue,
    selected_tier: registrationData.selectedTier,
    status: "Pending",
  };
}
