import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormValues {
  tipo: 'vender' | 'alugar';
  cidade: string;
  bairro: string;
  descricao: string;
}

interface FormsProps {
  onClose?: () => void;
}

const schema = yup.object().shape({
  tipo: yup.string().required('Por favor, selecione o tipo!').oneOf(['vender', 'alugar']),
  cidade: yup.string().required('Por favor, insira a cidade!'),
  bairro: yup.string().required('Por favor, insira o bairro!'),
  descricao: yup.string().required('Por favor, insira a descrição!'),
}) as yup.ObjectSchema<FormValues>;

const Forms: React.FC<FormsProps> = ({ onClose }) => {
  const { control, handleSubmit, formState: { errors }, register } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'vender',
    },
  });

  const onFinish = (values: FormValues) => {
    const mensagem = `Olá! Tenho um imóvel para ${values.tipo} no bairro ${values.bairro}, na cidade de ${values.cidade}.\n${values.descricao}.`;
    const mensagemCodificada = encodeURIComponent(mensagem.trim());
    const numeroVendas = "5532988549095";
    const numeroAluguel = "5532998650909";
    const numeroReImoveis = "5532999428800"; // WhatsApp oficial RE Imóveis

    // Envia para o WhatsApp de vendas ou aluguel normalmente
    const numeroWhatsapp = values.tipo === 'vender' ? numeroVendas : numeroAluguel;
    window.open(`https://wa.me/${numeroWhatsapp}?text=${mensagemCodificada}`, '_blank');

    // Também envia para o WhatsApp principal da RE Imóveis
    setTimeout(() => {
      window.open(`https://wa.me/${numeroReImoveis}?text=${mensagemCodificada}`, '_blank');
    }, 1000); // Pequeno delay para evitar bloqueio de popup
  };

  return (
    <div className="bg-re-bg rounded-2xl overflow-hidden relative max-w-xs mx-auto w-full shadow-xl border border-re-accent/20">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-re-text-main hover:text-re-accent transition-colors focus:outline-none z-10 bg-re-bg-alt rounded-full p-2 shadow-sm"
          aria-label="Fechar formulário"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      
      <div className="p-6 sm:p-7">
        <div className="text-center mb-6">
          <img
            src="/images/reimoveis2.webp"
            alt="RE Imóveis"
            width={150}
            height={50}
            className="mx-auto drop-shadow-md"
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          />
          <h2 className="text-xl font-bold mt-6 mb-2 text-re-accent tracking-tight font-montserrat">
            Anuncie seu imóvel
          </h2>
          <div className="h-1 w-16 bg-re-accent mx-auto rounded-full"></div>
          <p className="text-re-text-secondary mt-3 text-sm font-poppins">
            Preencha o formulário e entre em contato via WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit(onFinish)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-re-text-main mb-2 font-poppins">
              O que deseja fazer com seu imóvel?
            </label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange('vender')}
                    className={`py-2 px-2 border rounded-xl text-center transition-all duration-200 shadow-sm font-semibold text-xs tracking-tight focus:outline-none focus:ring-2 focus:ring-re-accent/40 font-poppins ${
                      field.value === 'vender'
                        ? 'bg-re-accent text-re-text-invert border-re-accent shadow-md'
                        : 'bg-re-bg text-re-text-main border-re-bg-alt hover:border-re-accent'
                    }`}
                  >
                    Vender
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('alugar')}
                    className={`py-2 px-2 border rounded-xl text-center transition-all duration-200 shadow-sm font-semibold text-xs tracking-tight focus:outline-none focus:ring-2 focus:ring-re-accent/40 font-poppins ${
                      field.value === 'alugar'
                        ? 'bg-re-accent text-re-text-invert border-re-accent shadow-md'
                        : 'bg-re-bg text-re-text-main border-re-bg-alt hover:border-re-accent'
                    }`}
                  >
                    Alugar
                  </button>
                </div>
              )}
            />
            {errors.tipo && (
              <p className="mt-1 text-xs text-re-error font-poppins">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cidade" className="block text-xs font-semibold text-re-text-main mb-2 font-poppins">
              Cidade
            </label>
            <input
              id="cidade"
              type="text"
              placeholder="Ex: São João del-Rei"
              className={`w-full px-3 py-2 rounded-xl border shadow-inner bg-re-bg-alt text-re-text-main font-medium text-xs font-poppins ${
                errors.cidade ? 'border-re-error ring-1 ring-re-error' : 'border-re-bg-alt focus:border-re-accent'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:ring-re-accent transition-all`}
              {...register("cidade")}
            />
            {errors.cidade && (
              <p className="mt-1 text-xs text-re-error font-poppins">{errors.cidade.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bairro" className="block text-xs font-semibold text-re-text-main mb-2 font-poppins">
              Bairro
            </label>
            <input
              id="bairro"
              type="text"
              placeholder="Ex: Centro"
              className={`w-full px-3 py-2 rounded-xl border shadow-inner bg-re-bg-alt text-re-text-main font-medium text-xs font-poppins ${
                errors.bairro ? 'border-re-error ring-1 ring-re-error' : 'border-re-bg-alt focus:border-re-accent'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:ring-re-accent transition-all`}
              {...register("bairro")}
            />
            {errors.bairro && (
              <p className="mt-1 text-xs text-re-error font-poppins">{errors.bairro.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="descricao" className="block text-xs font-semibold text-re-text-main mb-2 font-poppins">
              Descrição do imóvel
            </label>
            <textarea
              id="descricao"
              placeholder="Descreva seu imóvel em detalhes"
              rows={3}
              className={`w-full px-3 py-2 rounded-xl border shadow-inner bg-re-bg-alt text-re-text-main font-medium text-xs font-poppins resize-none ${
                errors.descricao ? 'border-re-error ring-1 ring-re-error' : 'border-re-bg-alt focus:border-re-accent'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:ring-re-accent transition-all`}
              {...register("descricao")}
            />
            {errors.descricao && (
              <p className="mt-1 text-xs text-re-error font-poppins">{errors.descricao.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 mt-4 bg-re-accent hover:bg-re-success text-re-text-invert font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-xs tracking-tight gap-2 font-montserrat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forms;