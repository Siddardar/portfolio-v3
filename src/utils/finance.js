const inflationRate = 0.0231; // 2.31%

/**
 * @param {Date|string} start         – start date (Date object or parsable string)
 * @param {number}      monthlyPremium
 * @param {number}      rateOfReturn  – annual (e.g. 0.05 for 5%)
 * @param {number}      feeRate       – annual fee rate (e.g. 0.01 for 1%)
 * @param {number}      years
 * @returns {Array<{date: Date, totalPremiumPaid: number, grossReturn: number, netReturn: number, feesPaid: number, netNominalTotal: number, netRealTotal: number}>}
 */
export const calculateReturns = (start, monthlyPremium, rateOfReturn, feeRate, years) => {
  const results = [];
  const startDate = new Date(start);

  const monthlyRate = rateOfReturn / 12;
  // net annual growth after fees:
  const effectiveAnnualNet = (1 + rateOfReturn) * (1 - feeRate) - 1;
  
  // per-month net compounding:
  //const monthlyNetRate = Math.pow(1 + effectiveAnnualNet, 1 / 12) - 1;
   const monthlyNetRate = effectiveAnnualNet/12;

  const totalMonths = years * 12;

  // --- First year: month-by-month ---
  for (let m = 1; m <= Math.min(12, totalMonths); m++) {
    const n = m; // months elapsed
    const totalPremiumPaid = monthlyPremium * n;

    // FV of annuity-due over n months
    const grossFV =
      monthlyPremium *
      ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const netFV =
      monthlyPremium *
      ((Math.pow(1 + monthlyNetRate, n) - 1) / monthlyNetRate) *
      (1 + monthlyNetRate);

    const grossReturn = grossFV - totalPremiumPaid;
    const netReturn = netFV - totalPremiumPaid;
    const feesPaid = grossReturn - netReturn;
    const netNominalTotal = netFV;
    // prorate inflation: (1+inflation)^(months/12)
    const netRealTotal = netNominalTotal / Math.pow(1 + inflationRate, n / 12);

    const asOf = new Date(startDate);
    asOf.setMonth(asOf.getMonth() + n);

    results.push({
      date: asOf,
      totalPremiumPaid,
      grossReturn,
      netReturn,
      feesPaid,
      netNominalTotal,
      netRealTotal,
    });
  }

  // --- Subsequent years: annual snapshots only ---
  for (let y = 2; y <= years; y++) {
    const n = y * 12; // total months
    const totalPremiumPaid = monthlyPremium * n;

    const grossFV =
      monthlyPremium *
      ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const netFV =
      monthlyPremium *
      ((Math.pow(1 + monthlyNetRate, n) - 1) / monthlyNetRate) *
      (1 + monthlyNetRate);

    const grossReturn = grossFV - totalPremiumPaid;
    const netReturn = netFV - totalPremiumPaid;
    const feesPaid = grossReturn - netReturn;
    const netNominalTotal = netFV;
    // full-year deflation
    const netRealTotal = netNominalTotal / Math.pow(1 + inflationRate, y);

    const asOf = new Date(startDate);
    asOf.setFullYear(asOf.getFullYear() + y);

    results.push({
      date: asOf,
      totalPremiumPaid,
      grossReturn,
      netReturn,
      feesPaid,
      netNominalTotal,
      netRealTotal,
    });
  }

  return results;
};

export const validateInputs = (monthlyPremium, startDate, faFund, benchmarkFund) => {

}