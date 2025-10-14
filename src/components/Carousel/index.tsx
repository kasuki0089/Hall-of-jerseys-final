"use client"; // necessário para permitir estado e efeitos no Next.js App Router

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

// -----------------------------
// Imports das imagens locais
// -----------------------------
import img1 from "@/public/images/banner/lebron_lakers.jpg";
import img2 from "@/public/images/banner/intermiami.jpg";
import img3 from "@/public/images/banner/bronw_eagles.jpg";
import img4 from "@/public/images/banner/okc.jpg";

// Tipo das props que o Carousel recebe
interface Slide {
  src: StaticImageData; // imagem local importada
  alt: string;          // texto alternativo (acessibilidade)
}

interface CarouselProps {
  slides: Slide[];
}


// COMPONENTE: Carousel
const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0); // índice do slide atual

  // Avança para o próximo slide (loopa ao final)
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Volta para o slide anterior (loopa ao início)
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-[100%] h-[100%] mx-auto overflow-hidden shadow-lg">
      {/* Área das imagens */}
      <div className="relative w-[100%] h-[100%]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* next/image otimiza automaticamente imagens importadas */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              placeholder="blur" // aplica blur automático para imagens locais
            />

          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-1 rounded-full hover:bg-opacity-70 transition"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-1 rounded-full hover:bg-opacity-70 transition"
      >
        ❯
      </button>

      {/* Indicadores de posição */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// COMPONENTE: CarouselExample (demonstração de uso)
const CarouselExample: React.FC = () => {
  const slides: Slide[] = [
    { src: img1, alt: "Imagem 1"},
    { src: img2, alt: "Imagem 2" },
    { src: img3, alt: "Imagem 3"},
    { src: img4, alt: "Imagem 4"},
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 h-[85vh]">
      <Carousel slides={slides} />
    </div>
  );
};

export default CarouselExample;
