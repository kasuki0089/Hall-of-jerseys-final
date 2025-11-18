'use client';
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="w-full bg-primary text-white py-3 shadow-md">
      <div className="max-w-8xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="w-32 md:w-40 h-8 md:h-10 flex items-center">
              <div className="text-2xl font-bold">HALL OF JERSEYS</div>
            </div>
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-7 font-light text-sm">
          <Link className="hover:text-secondary cursor-pointer transition duration-500" href="/produtos">PRODUTOS</Link>
          <Link className="hover:text-secondary cursor-pointer transition duration-500" href="/about">SOBRE</Link>
          <Link className="hover:text-secondary cursor-pointer transition duration-500" href="/contact">CONTATO</Link>
          <Link className="hover:text-secondary cursor-pointer transition duration-500" href="/suporte">SUPORTE</Link>
          {session?.user?.role === 'ADMIN' && (
            <Link className="hover:text-secondary cursor-pointer transition duration-500" href="/admin">ADMIN</Link>
          )}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-secondary transition duration-500" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-secondary transition duration-500" />
          
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-500"
              >
                <User className="w-4 h-4 text-secondary" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48 z-50">
                  <div className="px-4 py-2 border-b text-sm">
                    <p className="font-semibold">{session.user.nome}</p>
                    <p className="text-gray-600">{session.user.email}</p>
                  </div>
                  <Link href="/perfil" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Meu Perfil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <User className="w-4 h-4 text-secondary" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
