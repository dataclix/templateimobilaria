import React, { useState, useEffect } from 'react';
import {
  Slider,
  Box,
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

interface FiltroPrecoProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  modalidade: string;
  handlePriceChange: (field: 'min' | 'max', value: string) => void;
  formatCurrency: (value: number | undefined) => string;
}

const FiltroPreco: React.FC<FiltroPrecoProps> = ({
  minPrice,
  maxPrice,
  modalidade,
  handlePriceChange,
  formatCurrency
}) => {
  // Definir os valores máximos com base na modalidade
  const getMaxSliderValue = () => {
    return modalidade === 'VENDA' ? 3000000 : 7000;
  };

  const getMinSliderValue = () => {
    return modalidade === 'VENDA' ? 200000 : 500;
  };

  // Definir valores iniciais para o slider
  const [sliderValues, setSliderValues] = useState<number[]>([
    minPrice || getMinSliderValue(),
    maxPrice || getMaxSliderValue()
  ]);

  // Atualizar sliderValues quando minPrice ou maxPrice mudam externamente
  useEffect(() => {
    setSliderValues([
      minPrice || getMinSliderValue(),
      maxPrice || getMaxSliderValue()
    ]);
  }, [minPrice, maxPrice, modalidade]);

  // Função para formatar o valor exibido no slider
  const valueText = (value: number) => {
    return formatCurrency(value);
  };

  // Função para lidar com mudanças no slider
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderValues(newValue);
    }
  };

  // Função para atualizar o estado global quando o usuário termina de arrastar
  const handleSliderChangeCommitted = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [newMin, newMax] = newValue;
      
      // Definir como undefined se for igual aos valores padrão
      const finalMin = newMin === getMinSliderValue() ? undefined : newMin;
      const finalMax = newMax === getMaxSliderValue() ? undefined : newMax;
      
      handlePriceChange('min', finalMin?.toString() || '');
      handlePriceChange('max', finalMax?.toString() || '');
    }
  };

  // Marcas para o slider (personalizadas com base na modalidade)
  const marks = modalidade === 'VENDA' 
    ? [
        { value: 200000, label: '200 mil' },
        { value: 1000000, label: '1 milhão' },
        { value: 2000000, label: '2 milhões' },
        { value: 3000000, label: '3 milhões' },
      ]
    : [
        { value: 500, label: 'R$ 500' },
        { value: 2000, label: 'R$ 2 mil' },
        { value: 4500, label: 'R$ 4,5 mil' },
        { value: 7000, label: 'R$ 7 mil' },
      ];

  // Função para simplificar o display de valores grandes
  const formatSimplifiedValue = (value: number): string => {
    if (modalidade === 'VENDA') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1).replace('.0', '')} milhão`;
      } 
      if (value >= 100000) {
        return `${(value / 1000).toFixed(0)} mil`;
      }
    } else {
      if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1).replace('.0', '')} mil`;
      }
      return `R$ ${value}`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="py-1 px-3">
      <div className="flex items-center mb-1">
        <AttachMoney className="text-re-text-secondary mr-2" style={{ fontSize: '0.9rem' }} />
        <h3 className="text-xs text-re-text-main font-medium">
          Preço
        </h3>
      </div>
      
      <Box sx={{ px: 1, pt: 0, pb: 1 }}>
        <Slider
          value={sliderValues}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={valueText}
          getAriaValueText={valueText}
          min={getMinSliderValue()}
          max={getMaxSliderValue()}
          marks={marks}
          sx={{
            color: '#00D54B', // re-accent
            height: 4,
            '& .MuiSlider-thumb': {
              height: 18,
              width: 18,
              backgroundColor: '#ffffff',
              border: '2px solid #00D54B',
              boxShadow: '0 0 0 4px rgba(0, 213, 75, 0.12)',
              '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0 0 0 8px rgba(0, 213, 75, 0.16)',
              },
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#E5E7EB',
              height: 4,
              borderRadius: 2,
            },
            '& .MuiSlider-track': {
              height: 4,
              borderRadius: 2,
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#E5E7EB',
              height: 4,
              width: 2,
              marginTop: 0,
            },
            '& .MuiSlider-markActive': {
              backgroundColor: '#00D54B',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#2D3F42',
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
            },
            '& .MuiSlider-markLabel': {
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#6B7280',
              marginTop: '4px',
              lineHeight: 1,
            },
          }}
        />
      </Box>
      
      {(minPrice !== undefined || maxPrice !== undefined) && (
        <div className="text-[10px] text-re-text-secondary bg-gray-50 p-1 rounded-md border border-gray-100 -mt-1">
          <span className="text-re-text-main font-medium">Selecionado: </span>
          {minPrice !== undefined && maxPrice !== undefined ? (
            <>Entre <span className="font-medium text-re-accent">{formatCurrency(minPrice)}</span> e <span className="font-medium text-re-accent">{formatCurrency(maxPrice)}</span></>
          ) : minPrice !== undefined ? (
            <>A partir de <span className="font-medium text-re-accent">{formatCurrency(minPrice)}</span></>
          ) : maxPrice !== undefined ? (
            <>Até <span className="font-medium text-re-accent">{formatCurrency(maxPrice)}</span></>
          ) : ''}
        </div>
      )}
    </div>
  );
};

export default FiltroPreco; 