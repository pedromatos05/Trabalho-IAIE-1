'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react'; // Adicionei o Loader2 para ficar bonito

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// 👇 1. IMPORTANTE: Importar o Hook que criaste (o Motor)
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres.' }),
});

// 👇 2. IMPORTANTE: 'export function' (sem default) para não dar aquele erro
export function ClientLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLocalLoading, setIsLocalLoading] = React.useState(false);
  
  // 👇 3. A LIGAÇÃO MÁGICA: Aqui vamos buscar a função login ao teu Hook
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLocalLoading(true);

    // 👇 4. USAR O MOTOR: Chamamos a função login que está no use-auth.tsx
    const success = await login(values.email, values.password);
    
    setIsLocalLoading(false);

    if (success) {
      toast({
        title: 'Login efetuado!',
        description: 'A entrar na loja...',
      });
      // O redirecionamento acontece aqui
      router.push('/store');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro no Login',
        description: 'Email ou password incorretos.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} disabled={isLocalLoading} />
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
                <Input type="password" placeholder="••••••••" {...field} disabled={isLocalLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLocalLoading} size="lg">
          {isLocalLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A entrar...
            </>
          ) : (
            <>
              Entrar <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}