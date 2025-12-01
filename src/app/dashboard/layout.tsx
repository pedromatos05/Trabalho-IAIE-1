'use client'; // 👈 Obrigatório

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

// Imports do Visual (Sidebar)
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/dashboard/main-nav';
import { UserNav } from '@/components/dashboard/user-nav';
import { Logo } from '@/components/logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. O SEGURANÇA: Verifica se pode entrar
  useEffect(() => {
    // Só corremos a lógica quando o sistema acabar de carregar
    if (!loading) {
      // Se não houver user OU se o role não for 'admin' (convertendo para minusculas por segurança)
      if (!user || user.role?.toLowerCase() !== 'admin') {
        console.warn("⛔ Acesso Negado: Redirecionando para login...");
        router.push('/admin/login'); // Expulsa o intruso
      } else {
        // Se for admin, deixa passar
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  // 2. A SALA DE ESPERA: Enquanto verifica, não mostra o Dashboard
  if (loading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          <p className="text-zinc-400 text-sm">A verificar permissões de administrador...</p>
        </div>
      </div>
    );
  }

  // 3. O VISUAL: Se chegou aqui, é Admin. Mostra a Sidebar.
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-headline text-lg font-semibold">Games Paradise</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Título ou Breadcrumbs podem vir aqui */}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}