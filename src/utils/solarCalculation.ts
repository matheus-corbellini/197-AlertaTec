export const calculateMonthlyGeneration = (systemPower: number): number => {
  const monthlyGeneration = systemPower * 4.5 * 30 * 0.8;
  return monthlyGeneration;
};

export const calculateTotalSystemValue = (
  systemPower: number,
  costPerKWp: number
): number => {
  const totalSystemValue = systemPower * costPerKWp + 1500;
  return totalSystemValue;
};

export const calculateMonthlySavings = (
  consumption: number,
  generation: number,
  tariff: number
): number => {
  const monthlySaving =
    consumption * tariff - (consumption - generation) * tariff;
  return monthlySaving;
};

export const calculatePaybackPeriod = (
  totalValue: number,
  monthlySavings: number
): number => {
  const paybackPeriod = totalValue / monthlySavings;
  return paybackPeriod;
};
