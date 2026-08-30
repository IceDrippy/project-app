export function Register(registrationData) {
  const totalHours =
    registrationData.total_flight_hours?.total ??
    registrationData.total_flight_hours ??
    registrationData.hours?.total ??
    0;

  return {
    aircraft_type: registrationData.aircraft_type || registrationData.aircraftType,
    make: registrationData.make,
    model: registrationData.model,
    year: registrationData.year,
    engine_type: registrationData.engine_type || registrationData.engineType,
    serial_number: registrationData.serial_number || registrationData.serialNum,
    flight_purpose: registrationData.flight_purpose || registrationData.flightPurpose,
    storage_location: registrationData.storage_location || registrationData.storage,
    home_base: registrationData.home_base || registrationData.homeBase,
    pilot_certification: registrationData.pilot_certification || registrationData.pilotCert,
    medical_status: registrationData.medical_status || registrationData.medicalStatus,
    total_flight_hours: Number(totalHours) || 0,
    hull_value: registrationData.hull_value || registrationData.hullValue,
    selected_tier: registrationData.selected_tier || registrationData.selectedTier,
    status: "Pending",
  };
}