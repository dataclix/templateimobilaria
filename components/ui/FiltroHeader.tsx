import React from 'react';
import { motion } from 'framer-motion';
import { Home, Sell } from '@mui/icons-material';

interface FiltroHeaderProps {
  modalidade: string;
  onModalidadeChange: (modalidade: string) => void;
  isLoading: boolean;
}

const FiltroHeader: React.FC<FiltroHeaderProps> = ({
  modalidade,
  onModalidadeChange,
  isLoading
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-base font-semibold text-re-text-main text-center mb-3">
        Busca de Imóveis
      </h2>
      
      <div className="flex gap-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onModalidadeChange("VENDA")}
          disabled={isLoading}
          className={`flex-1 py-3 px-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ease-in-out ${
            modalidade === 'VENDA'
            ? 'bg-re-accent text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Sell style={{ fontSize: '1.1rem' }} />
          Comprar
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onModalidadeChange("ALUGUEL")}
          disabled={isLoading}
          className={`flex-1 py-3 px-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ease-in-out ${
            modalidade === 'ALUGUEL'
            ? 'bg-re-accent text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Home style={{ fontSize: '1.1rem' }} />
          Alugar
        </motion.button>
      </div>
    </div>
  );
};

export default FiltroHeader; 