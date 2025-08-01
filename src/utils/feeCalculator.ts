export const calculateFee = (weight: number, parcelType: string): number => {
  const baseRate = 50;
  const weightRate = 10;
  
  let typeMultiplier = 1;
  switch (parcelType.toLowerCase()) {
    case 'fragile':
      typeMultiplier = 1.5;
      break;
    case 'express':
      typeMultiplier = 2;
      break;
    case 'document':
      typeMultiplier = 0.8;
      break;
    default:
      typeMultiplier = 1;
  }
  
  return Math.round((baseRate + (weight * weightRate)) * typeMultiplier);
};