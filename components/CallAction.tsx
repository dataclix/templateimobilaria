import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

type CallActionProps = {
  // whatsappNumber prop não é mais necessária aqui, será usada internamente no form
};

const CallAction: React.FC<CallActionProps> = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const companyWhatsappNumber = "5500000000000"; // WhatsApp da Imobiliária

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!phone.trim() || !message.trim()) {
      alert("Por favor, preencha o telefone e a mensagem.");
      return;
    }

    const whatsappMessage = `Olá! Meu telefone é ${phone}. Gostaria de perguntar sobre: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${companyWhatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Limpar campos após envio (opcional)
    setPhone('');
    setMessage('');
    alert("Você será redirecionado para o WhatsApp para enviar sua mensagem!");
  };

  return (
    <div className="relative w-full min-h-[650px] mt-20 overflow-hidden py-16">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fundo.webp"
          alt="Background Imóvel"
          className="z-0 object-cover w-full h-full"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {/* Overlay reforçado para contraste */}
        <div className="absolute inset-0 bg-gradient-to-r from-re-base/95 to-re-text-main/80 z-10"></div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-[10%] right-[10%] w-48 h-48 rounded-full bg-re-accent/20 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.15, 0.2],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
        style={{ zIndex: 5 }}
      />

      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[650px] flex items-center relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          {/* Left side - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8 max-w-xl mx-auto md:mx-0"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-montserrat text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                Precisa de ajuda?
              </h2>
              <p className="text-xl md:text-2xl font-light font-poppins text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                Entre em contato conosco <br />
                Estamos prontos para ajudar
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <h3 className="text-xl font-semibold mb-3 border-b border-white/20 pb-2 font-montserrat text-white">
                Informações de Contato
              </h3>
              <div className="space-y-4 font-poppins">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <p>Endereço da Imobiliária, 100, Sua Cidade - UF, 00000-000</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FaPhone className="text-lg" />
                  </div>
                  <p>+55 (00) 0000-0000</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <p>contato@imobiliaria-template.com.br</p>
                </div>
              </div>
              <div className="pt-4">
                <span className="block mb-2 font-semibold text-white/80 font-montserrat">Redes Sociais</span>
                <div className="flex gap-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto md:mx-0 md:ml-auto border border-re-accent/30"
            role="form"
            aria-label="Formulário de contato via WhatsApp"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-re-base mb-6 text-center font-montserrat">
              Alguma pergunta?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-re-text-main mb-1 font-poppins">
                  Seu telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Digite seu telefone aqui..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-re-accent focus:border-transparent transition-colors font-poppins"
                  aria-label="Telefone para contato"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-re-text-main mb-1 font-poppins">
                  Sua pergunta
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Sua pergunta..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-re-accent focus:border-transparent transition-colors resize-none font-poppins"
                  aria-label="Mensagem de contato"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-re-accent hover:bg-re-base text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-re-accent focus:ring-offset-2 flex items-center justify-center font-poppins shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaWhatsapp className="mr-2" size={18} />
                ENVIAR MENSAGEM
              </motion.button>
              <p className="text-xs text-gray-500 text-center mt-4 font-poppins">
                Fique tranquilo, não compartilhamos seus dados com terceiros.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(CallAction);