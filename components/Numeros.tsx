import { motion, useInView } from "framer-motion";
import React, { memo, useRef } from "react";
import CountUp from "react-countup";

interface StatItem {
  value: string;
  title: string;
  subtitle: string;
  endValue: number;
  suffix?: string;
}

const stats: StatItem[] = [
  {
    value: "80+",
    endValue: 80,
    suffix: "+",
    title: "Propriedades em Transação",
    subtitle: "Número total de propriedades em processo de compra ou venda."
  },
  {
    value: "300+",
    endValue: 300,
    suffix: "+",
    title: "Propriedades para Comprar",
    subtitle: "Imóveis disponíveis para compra em nosso portfólio."
  },
  {
    value: "100+",
    endValue: 100,
    suffix: "+",
    title: "Imóveis Alugados",
    subtitle: "Quantidade de propriedades atualmente alugadas."
  },
  {
    value: "1k",
    endValue: 1,
    suffix: "k+",
    title: "Propriedades Vendidas",
    subtitle: "Número de propriedades vendidas com sucesso s."
  }
];

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  },
  item: {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
};

interface StatCardProps {
  stat: StatItem;
  index: number;
  isInView: boolean;
}

const StatCard = memo(({ stat, index, isInView }: StatCardProps) => (
  <motion.div
    variants={animations.item}
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.2 }
    }}
    className="relative bg-[#ededed] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
               transform-gpu backdrop-blur-sm border border-gray-100"
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-4xl font-bold text-[#ee731a] mb-6"
    >
      {isInView && (
        <CountUp
          start={0}
          end={stat.endValue}
          duration={2.5}
          decimals={stat.endValue % 1 !== 0 ? 1 : 0}
          suffix={stat.suffix}
          useEasing={true}
          enableScrollSpy
          scrollSpyDelay={100}
        />
      )}
    </motion.div>
    <h4 className="text-xl font-semibold text-gray-800 mb-3">
      {stat.title}
    </h4>
    <p className="text-sm text-gray-600">
      {stat.subtitle}
    </p>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const Numeros = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-100px",
    amount: 0.2
  });

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-50" 
      ref={sectionRef}
      aria-labelledby="numbers-title"
    >
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={animations.title}
      >
        <h2 
          id="numbers-title"
          className="text-3xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto"
        >
          A nossa missão é redefinir o mercado imobiliário a favor do cliente.
        </h2>
        <p className="text-lg text-gray-600">
          Transparência, eficiência e inovação em cada transação.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={animations.container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.value}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default memo(Numeros);
