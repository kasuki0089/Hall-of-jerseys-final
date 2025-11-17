import MainTemplate from "@/templates/MainTemplate/Index";
import React from "react";

export default function ContatoPage() {
  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-semibold mb-10">Contato</h1>

        <form className="w-full max-w-xl flex flex-col gap-6">
          {/* Nome */}
          <div id="input-single" className="relative w-full">
            <input
              type="text"
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className="absolute left-0 top-2 text-sm text-gray-600 transition-all peer-focus:-translate-y-4 peer-focus:text-primary peer-focus:font-bold peer-valid:-translate-y-4 peer-valid:text-primary peer-valid:font-bold">
              Nome
            </label>
          </div>

          {/* Email */}
          <div id="input-single" className="relative w-full">
            <input
              type="email"
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className="absolute left-0 top-2 text-sm text-gray-600 transition-all peer-focus:-translate-y-4 peer-focus:text-primary peer-focus:font-bold peer-valid:-translate-y-4 peer-valid:text-primary peer-valid:font-bold">
              E-mail
            </label>
          </div>

          {/* Telefone */}
          <div id="input-single" className="relative w-full">
            <input
              type="text"
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className="absolute left-0 top-2 text-sm text-gray-600 transition-all peer-focus:-translate-y-4 peer-focus:text-primary peer-focus:font-bold peer-valid:-translate-y-4 peer-valid:text-primary peer-valid:font-bold">
              Telefone
            </label>
          </div>

          {/* Motivo */}
          <div className="mt-4">
            <h2 className="font-semibold text-lg text-center mb-2">
              Qual o motivo do seu contato?
            </h2>

            <div className="flex flex-col gap-2 pl-6">
              {["Compras","Vendas","Entregas","Feedback","Curriculo"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="radio" name="motivo" className="accent-primary" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Problema */}
          <div className="flex flex-col mt-4">
            <label className="font-semibold text-lg mb-2 text-primary">
              Nos diga o problema em rápidas palavras:
            </label>
            <textarea className="border border-gray-400 focus:border-primary rounded-md p-3 h-40 resize-none"></textarea>
          </div>

          {/* Botão */}
          <div className="w-full flex justify-center mt-6">
            <button type="submit" className="px-8 py-2 border border-primary text-primary rounded-[0.5vw] hover:bg-primary hover:text-white transition duration-300 cursor-pointer">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </MainTemplate>
  );
}
