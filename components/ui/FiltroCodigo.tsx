import React from 'react';
import {
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface FiltroCodigoProps {
  localIdInterno: string | undefined;
  handleCodigoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FiltroCodigo: React.FC<FiltroCodigoProps> = ({
  localIdInterno,
  handleCodigoChange
}) => {
  // Estilos dos componentes MUI
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#2D3F42',
    height: '42px',
    border: '1px solid #E5E7EB',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#00D54B',
    },
    '&.Mui-focused': {
      borderColor: '#00D54B',
      boxShadow: '0 0 0 2px rgba(0, 213, 75, 0.1)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent'
    }
  };

  return (
    <div className="py-3 border-t border-gray-200">
      <div className="flex items-center mb-2">
        <Search className="text-re-text-secondary mr-2" style={{ fontSize: '1rem' }} />
        <h3 className="text-re-text-main font-medium">Busca por Código</h3>
      </div>
      
      <TextField
        placeholder="Digite o código do imóvel"
        variant="outlined"
        fullWidth
        InputProps={{ 
          startAdornment: (
            <InputAdornment position="start">
              <Search style={{ fontSize: '0.9rem', color: '#A0AEB0' }} />
            </InputAdornment>
          ), 
          sx: inputStyle 
        }}
        value={localIdInterno || ''}
        onChange={handleCodigoChange}
      />
    </div>
  );
};

export default FiltroCodigo; 