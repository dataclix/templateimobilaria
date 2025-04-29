import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Home, KeyboardArrowDown } from '@mui/icons-material';

interface SelectOption {
  label: string;
  value: string;
}

interface FiltroTipoImovelProps {
  categoriaOptions: SelectOption[];
  categoriaSelecionada: string | undefined;
  handleCategoriaChange: (e: SelectChangeEvent<string>) => void;
}

const FiltroTipoImovel: React.FC<FiltroTipoImovelProps> = ({
  categoriaOptions,
  categoriaSelecionada,
  handleCategoriaChange
}) => {
  // Estilos dos componentes MUI
  const selectStyle = {
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
    }
  };

  return (
    <div className="py-3 border-t border-gray-200">
      <div className="flex items-center mb-2">
        <Home className="text-re-text-secondary mr-2" style={{ fontSize: '1rem' }} />
        <h3 className="text-re-text-main font-medium">Tipo de Imóvel</h3>
      </div>
      
      <FormControl fullWidth variant="outlined">
        <Select
          value={categoriaSelecionada ?? "0"}
          onChange={handleCategoriaChange}
          IconComponent={KeyboardArrowDown}
          sx={selectStyle}
          MenuProps={{ 
            PaperProps: { 
              sx: { 
                maxHeight: 300, 
                marginTop: '4px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              } 
            } 
          }}
          displayEmpty
        >
          {categoriaOptions.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              sx={{
                fontSize: '0.9rem',
                padding: '8px 16px',
                '&:hover': { backgroundColor: 'rgba(0, 213, 75, 0.08)' },
                '&.Mui-selected': { backgroundColor: 'rgba(0, 213, 75, 0.12)' }
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default FiltroTipoImovel; 