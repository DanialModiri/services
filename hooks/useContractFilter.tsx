import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { ContractFilters } from '../types';

interface ContractFilterContextType {
  filters: ContractFilters;
  setFilters: (filters: ContractFilters) => void;
}

const ContractFilterContext = createContext<ContractFilterContextType | undefined>(undefined);

export const ContractFilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<ContractFilters>({});

  return (
    <ContractFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </ContractFilterContext.Provider>
  );
};

export const useContractFilter = () => {
  const context = useContext(ContractFilterContext);
  if (!context) {
    throw new Error('useContractFilter must be used within a ContractFilterProvider');
  }
  return context;
};
