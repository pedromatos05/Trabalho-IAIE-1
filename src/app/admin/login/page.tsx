'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(1, { message: 'Password obrigatória.' }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, logout } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'login-hero');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const success = await login(values.email, values.password);

    if (success) {
      try {
        const storedSession = localStorage.getItem('loggedInUser'); // Confirma se é este o nome no useAuth
        const user = storedSession ? JSON.parse(storedSession) : null;

        // Verifica se é Admin
        if (user && user.role?.toLowerCase() === 'admin') {
            toast({
                title: 'Bem-vindo, Administrador!',
                description: 'A iniciar o painel...',
            });
            
            // 👇 AQUI ESTÁ A CORREÇÃO: Redireciona para /dashboard
            router.push('/dashboard'); 
            
        } else {
            console.warn("⛔ Acesso negado. Role:", user?.role);
            throw new Error('Não tem permissões de administrador.');
        }

      } catch (error) {
        logout(); 
        toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Esta conta não tem permissões de administrador."
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: "Email ou password incorretos."
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-card relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Logo className="size-8" />
          <h1 className="font-headline text-xl font-semibold">
            Games Paradise
          </h1>
        </div>
        
        <div className="w-full max-w-sm">
          <h2 className="font-headline text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-muted-foreground mb-8">
            Aceda ao seu painel para gerir vendas, stock e clientes.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@gamesparadise.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A verificar...
                    </>
                ) : (
                    "Entrar no Painel"
                )}
              </Button>
            </form>
          </Form>

        </div>
        <footer className="absolute bottom-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Games Paradise. All rights reserved.
        </footer>
      </div>

      <div className="hidden lg:block w-1/2 relative">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <h3 className="font-headline text-4xl font-bold leading-tight">
            Automação em tempo real para o seu império de jogos.
          </h3>
          <p className="mt-4 text-lg opacity-90 text-gray-200">
            Sincronize vendas, stock e dados de clientes de forma transparente e centralizada.
          </p>
        </div>
      </div>
    </div>
  );
}