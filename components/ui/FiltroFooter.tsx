import React from 'react';
import { motion } from 'framer-motion';
import { Search, Tune } from '@mui/icons-material';

interface FiltroFooterProps {
  isLoading: boolean;
  handleApplyFilters: () => void;
  showModal: () => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

const FiltroFooter: React.FC<FiltroFooterProps> = ({
  isLoading,
  handleApplyFilters,
  showModal,
  clearFilters,
  hasFilters
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleApplyFilters}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-md text-sm font-medium bg-re-accent text-white shadow-sm hover:bg-opacity-90 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Buscando...
          </>
        ) : (
          <>
            <Search style={{ fontSize: '1.1rem' }} /> 
            Aplicar Filtros
          </>
        )}
      </motion.button>
      
      <motion.button 
        whileTap={{ scale: 0.98 }} 
        onClick={showModal} 
        className="w-full py-2.5 px-4 rounded-md text-sm font-medium bg-re-base text-white hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors mt-2"
      >
        <Tune style={{ fontSize: '1rem' }} /> 
        Filtros Avançados
      </motion.button>
      
      {hasFilters && !isLoading && (
        <div className="mt-3 flex justify-center">
          <button 
            onClick={clearFilters} 
            className="text-re-accent text-xs font-medium hover:underline py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
            </svg>
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltroFooter; 