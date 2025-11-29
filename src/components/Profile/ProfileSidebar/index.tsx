"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  MapPin, 
  Package, 
  Star, 
  Settings, 
  LogOut,
  LucideIcon
} from "lucide-react";

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const sidebarItems: SidebarItem[] = [
  { icon: User, label: "Dados Pessoais", href: "/perfil" },
  { icon: MapPin, label: "Lista de endereços", href: "/perfil/enderecos" },
  { icon: Package, label: "Pedidos", href: "/perfil/pedidos" },
  { icon: Star, label: "Avaliações", href: "/perfil/avaliacoes" },
  { icon: Settings, label: "Acessibilidade", href: "/perfil/acessibilidade" },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    // Implementar logout
    window.location.href = "/api/auth/signout";
  };

  return (
    <aside className="w-full lg:w-64 bg-[#003087] text-white min-h-screen p-4">
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </nav>
    </aside>
  );
}
