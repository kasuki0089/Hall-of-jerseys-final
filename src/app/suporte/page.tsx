'use client';
import MainTemplate from "@/templates/MainTemplate/Index";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "As jerseys vendidas são originais ou réplicas?",
    answer: "Nossos produtos incluem tanto jerseys originais (Authentic) quanto réplicas premium, dependendo do modelo disponível. Todas as informações sobre o tipo de jersey estão descritas na página de cada produto."
  },
  {
    question: "As jerseys são importadas?",
    answer: "Sim! Todas as jerseys são importadas de fornecedores confiáveis, garantindo qualidade, autenticidade e fidelidade às versões usadas pelas equipes nas principais ligas americanas."
  },
  {
    question: "Vocês trabalham com tamanhos femininos e infantis?",
    answer: "No momento, não trabalhamos com versões femininas ou infantis. Todas as jerseys disponíveis são modelos adultos."
  },
  {
    question: "Como escolher o tamanho correto da minha jersey?",
    answer: "Cada produto possui uma tabela de medidas oficial da liga ou fabricante. Recomendamos comparar com uma camiseta sua para garantir o melhor ajuste. Em caso de dúvida, nossa equipe de suporte pode ajudar."
  },
  {
    question: "Posso trocar a jersey caso o tamanho não sirva?",
    answer: "Sim! Realizamos trocas dentro do prazo estipulado, desde que o produto não tenha sido usado e esteja com etiquetas originais. É só entrar em contato com nossa equipe."
  },
  {
    question: "Vocês enviam para todo o Brasil?",
    answer: "Sim! Realizamos entregas para todos os estados brasileiros através de transportadoras parceiras e Correios."
  },
  {
    question: "Quais são as formas de pagamento aceitas?",
    answer: "Aceitamos cartão de crédito, PIX, boleto e carteiras digitais, dependendo da disponibilidade no momento da compra."
  },
  {
    question: "É possível parcelar a compra?",
    answer: "Sim! Parcelamos em até 12x no cartão de crédito, com ou sem juros dependendo das condições vigentes."
  },
  {
    question: "Vocês fazem jerseys personalizadas (nome e número)?",
    answer: "Não. No momento, não oferecemos personalização nas jerseys."
  },
  {
    question: "As jerseys vêm com etiquetas e patches oficiais das ligas?",
    answer: "Sim! Todos os produtos acompanham etiquetas oficiais correspondentes ao modelo e, quando aplicável, patches oficiais das ligas."
  },
  {
    question: "O que devo fazer se receber um produto com defeito ou errado?",
    answer: "Entre em contato imediatamente com nosso suporte enviando fotos ou vídeos do problema. Faremos a troca sem custo adicional, conforme nossa política de garantia e devolução."
  }
];

function AccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-5 px-6 text-left hover:bg-gray-50 transition-colors duration-300"
      >
        <span className="font-semibold text-lg text-gray-800">{item.question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function SuportePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-12 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-3 text-primary">
            Suporte
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            FAQ – Dúvidas Frequentes
          </p>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => toggleAccordion(index)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Não encontrou a resposta que procurava?
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300 font-semibold"
            >
              Entre em contato
            </a>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
