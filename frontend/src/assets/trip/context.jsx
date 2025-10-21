// TripContext.js
import { createContext, useContext } from 'react';

export const TripContext = createContext();



export function useTripInfo() {
  return useContext(TripContext);
}

