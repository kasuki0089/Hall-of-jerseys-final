'use client';   
import { Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import logomarca from "@/public/images/logomarca.jpeg";

export default function Navbar() {
  return (  
    <nav className="w-full bg-primary text-white py-3 px-8 flex items-center justify shadow-md">
      <div className="flex items-center">
        <div className="w-40 h-10 flex items-center justify-center">
          <Image src={logomarca} alt="Logomarca" className="w-full h-full object-contain"/>
        </div>
      </div>

      <ul className="hidden md:flex items-center gap-7 font-light text-sm ml-[50vw]">
        <li className="hover:text-secondary cursor-pointer transition duration:500">PRODUTOS</li>
        <li className="hover:text-secondary cursor-pointer transition duration:500">SOBRE</li>
        <li className="hover:text-secondary cursor-pointer transition duration:500">CONTATO</li>
        <li className="hover:text-secondary cursor-pointer transition duration:500">SUPORTE</li>
      </ul>

      <div className="flex items-center gap-4 ml-[12vw]">
        <Search className="w-5 h-5 cursor-pointer hover:text-secondary transition duration-500" />
        <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-secondary transition duration-500" />
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-500">
          <User className="w-4 h-4 text-secondary" />
        </div>
      </div>
    </nav>
  );
}
