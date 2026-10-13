const lkr = new Intl.NumberFormat('en-LK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 4850 -> "Rs. 4,850.00" */
export function money(value) {
  return `Rs. ${lkr.format(Number(value ?? 0))}`;
}
