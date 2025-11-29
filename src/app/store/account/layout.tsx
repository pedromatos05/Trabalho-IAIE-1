
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CircleUser, Package, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/store/account/profile', label: 'O Meu Perfil', icon: CircleUser },
  { href: '/store/account/orders', label: 'Encomendas', icon: Package },
  { href: '/store/points', label: 'Loja de Pontos', icon: Trophy },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: 'Precisa de fazer login para aceder a esta página.',
      });
      router.replace('/store/login');
    }
  }, [user, loading, router, toast]);

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <p>A verificar autenticação...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/50 text-center">
                <p className="text-sm text-muted-foreground">Saldo de Pontos</p>
                <p className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Trophy className="size-6" />
                  {user.points_saldo.toLocaleString('de-DE')}
                </p>
              </div>
              <Separator />
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
