export function calculatePremium({
  hullValue = 450000,
  selectedTier = "professional",
  flightPurpose = "Pleasure and Buisness",
  storage = "Hangar",
  totalHours = 1250,
  certLevel = "PPL License",
  medicalStatus = "First Class - Active",
  deductible = 2500,
} = {}) {
  const tierMultipliers = {
    standard: 1.08,
    professional: 1.15,
    premium: 1.32,
  };

  const purposeRisk = {
    "Pleasure and Buisness": 0.009,
    "Industrial Aid": 0.012,
    "Commercial Charter": 0.017,
    "Instruction & Rental": 0.014,
  };

  const storageRisk = {
    Hangar: 0.006,
    Tiedown: 0.008,
    "Maintained Ramp": 0.01,
  };

  const certRisk = {
    "PPL License": 0.0045,
    "CPL License": 0.0035,
    "ATPL License": 0.0028,
  };

  const medicalRisk = {
    "First Class - Active": 0.0022,
    "Second Class": 0.0035,
    "Third Class": 0.005,
  };

  const baseRate = 1200;
  const resolvedTier = tierMultipliers[selectedTier]
    ? selectedTier
    : "professional";
  const resolvedPurpose = purposeRisk[flightPurpose]
    ? flightPurpose
    : "Pleasure and Buisness";
  const resolvedStorage = storageRisk[storage] ? storage : "Hangar";
  const resolvedCert = certRisk[certLevel] ? certLevel : "PPL License";
  const resolvedMedical = medicalRisk[medicalStatus]
    ? medicalStatus
    : "First Class - Active";
  const normalizedHullValue = Number.isFinite(Number(hullValue))
    ? Number(hullValue)
    : 450000;
  const normalizedHours = Number.isFinite(Number(totalHours))
    ? Number(totalHours)
    : 0;

  const hullFactor = normalizedHullValue * 0.018;
  const pilotFactor = Math.max(0, (1500 - normalizedHours) * 1.5);
  const purposeFactor = normalizedHullValue * purposeRisk[resolvedPurpose];
  const storageFactor = normalizedHullValue * storageRisk[resolvedStorage];
  const certFactor = normalizedHullValue * certRisk[resolvedCert];
  const medicalFactor = normalizedHullValue * medicalRisk[resolvedMedical];

  const subtotal =
    baseRate +
    hullFactor +
    pilotFactor +
    purposeFactor +
    storageFactor +
    certFactor +
    medicalFactor;

  const tierAdjusted = subtotal * tierMultipliers[resolvedTier];
  const deductibleDiscount =
    deductible > 0 ? Math.min(deductible * 0.03, 500) : 0;
  const premium = Math.max(900, tierAdjusted - deductibleDiscount);

  return {
    premium: Number(premium.toFixed(2)),
    monthly: Number((premium / 12).toFixed(2)),
    breakdown: {
      baseRate: Number(baseRate.toFixed(2)),
      hullFactor: Number(hullFactor.toFixed(2)),
      pilotFactor: Number(pilotFactor.toFixed(2)),
      purposeFactor: Number(purposeFactor.toFixed(2)),
      storageFactor: Number(storageFactor.toFixed(2)),
      certFactor: Number(certFactor.toFixed(2)),
      medicalFactor: Number(medicalFactor.toFixed(2)),
      deductibleDiscount: Number(deductibleDiscount.toFixed(2)),
      tierMultiplier: tierMultipliers[resolvedTier],
    },
  };
}

export function buildQuoteSummary(options = {}) {
  const { premium, monthly, breakdown } = calculatePremium(options);
  const selectedTier = ["standard", "professional", "premium"].includes(
    options.selectedTier,
  )
    ? options.selectedTier
    : "professional";
  const tierLabel =
    selectedTier === "professional"
      ? "Professional (Recommended)"
      : selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);

  return {
    premium: `R${premium.toLocaleString()}`,
    period: "/ month",
    tier: tierLabel,
    hullValue: `R${(options.hullValue ?? 450000).toLocaleString()}`,
    liability: "R1,000,000",
    deductible: `R${(options.deductible ?? 2500).toLocaleString()}`,
    monthlyLabel: `R${monthly.toLocaleString()}`,
    annualLabel: `R${premium.toLocaleString()}/year`,
    breakdown,
  };
}
