import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { LocationCity, KeyboardArrowDown } from '@mui/icons-material';

interface SelectOption {
  label: string;
  value: string;
  id?: number;
}

interface SelectedLocation {
  id: number;
  nome: string;
  type: "cidade" | "bairro";
}

interface FiltroLocalizacaoProps {
  cidadeOptions: SelectOption[];
  bairroOptions: SelectOption[];
  selectedLocations: SelectedLocation[];
  isLoading: boolean;
  handleLocationSelect: (e: SelectChangeEvent<string>, type: "cidade" | "bairro") => void;
  removeLocation: (location: SelectedLocation) => void;
  bairros: any[];
  cidades: any[];
}

const FiltroLocalizacao: React.FC<FiltroLocalizacaoProps> = ({
  cidadeOptions,
  bairroOptions,
  selectedLocations,
  isLoading,
  handleLocationSelect,
  removeLocation,
  bairros,
  cidades
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
    <div className="py-3">
      <div className="mb-2">
        <div className="flex items-center mb-2">
          <LocationCity className="text-re-text-secondary mr-2" style={{ fontSize: '1rem' }} />
          <h3 className="text-re-text-main font-medium">Localização</h3>
        </div>
      </div>

      {/* Seletor de Cidade */}
      <FormControl fullWidth variant="outlined" className="mb-2">
        <Select
          value=""
          onChange={(e) => handleLocationSelect(e, "cidade")}
          disabled={isLoading || cidadeOptions.length <= 1}
          displayEmpty
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
          renderValue={(value) => (
            <span style={{ color: '#718096', display: 'block', padding: '2px 0' }}>
              Selecione uma cidade
            </span>
          )}
        >
          <MenuItem value="" disabled sx={{ display: 'none' }}>
            Selecione uma cidade
          </MenuItem>
          {cidadeOptions.slice(1).map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value} 
              disabled={selectedLocations.some(l => l.type === 'cidade' && l.id === option.id)}
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

      {/* Seletor de Bairro */}
      <FormControl fullWidth variant="outlined" className="mb-3">
        <Select
          value=""
          onChange={(e) => handleLocationSelect(e, "bairro")}
          disabled={selectedLocations.filter(loc => loc.type === "cidade").length === 0 || isLoading || bairroOptions.length <= 1}
          displayEmpty
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
          renderValue={(value) => (
            <span style={{ color: '#718096', display: 'block', padding: '2px 0' }}>
              Selecione um bairro
            </span>
          )}
        >
          <MenuItem value="" disabled sx={{ display: 'none' }}>
            Selecione um bairro
          </MenuItem>
          {bairroOptions.slice(1).map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value} 
              disabled={selectedLocations.some(l => l.type === 'bairro' && l.id === option.id)}
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

      {/* Localizações selecionadas */}
      {selectedLocations.filter(l => l.type === 'cidade').length > 0 && (
        <div className="space-y-2 mt-2">
          {selectedLocations.filter(l => l.type === 'cidade').map(cidade => {
            const cidadeNomeOriginal = cidades.find(c => c.id === cidade.id)?.nome || cidade.nome;
            return (
              <div key={`cidade-${cidade.id}`} className="bg-gray-50 rounded-md p-2 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-re-text-main text-sm">{cidadeNomeOriginal}</span>
                  <button 
                    onClick={() => removeLocation(cidade)} 
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remover cidade"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="pl-2 mt-1 space-y-1">
                  {selectedLocations.filter(l => {
                    if (l.type !== 'bairro') return false;
                    const bairroData = bairros.find(b => b.id === l.id);
                    return bairroData?.cidade.nome === cidadeNomeOriginal;
                  }).map(bairro => (
                    <div key={`bairro-${bairro.id}`} className="flex items-center justify-between bg-white p-1 rounded border border-gray-100">
                      <span className="text-re-text-secondary text-xs">{bairros.find(b => b.id === bairro.id)?.nome || bairro.nome.split(' (')[0]}</span>
                      <button 
                        onClick={() => removeLocation(bairro)} 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remover bairro"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FiltroLocalizacao; 