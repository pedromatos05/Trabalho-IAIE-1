'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';

// --- SCHEMA DE VALIDAÇÃO ---
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'O apelido deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Tem de aceitar os termos e condições."
  })
});

export function ClientRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  // --- FUNÇÃO DE ENVIO ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // LOG PARA O BROWSER (Aparece no F12)
    console.log("🔵 [BROWSER] Dados capturados:", values);

    try {
      // O link tem de ter a barra "/" no início
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const responseText = await response.text();
      console.log(`🔵 [BROWSER] Status do servidor: ${response.status}`, responseText);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${responseText}`);
      }

      toast({
        title: 'Sucesso!',
        description: 'Conta criada. A redirecionar...',
      });

      // Redirecionar
      setTimeout(() => {
        router.push('/store/login');
      }, 1500);

    } catch (error: any) {
      console.error("🔴 [BROWSER] ERRO:", error);
      toast({
        variant: "destructive",
        title: 'Erro no Registo',
        description: 'Não foi possível contactar o servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Primeiro Nome</FormLabel>
                <FormControl>
                    <Input placeholder="Seu Nome" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Apelido</FormLabel>
                <FormControl>
                    <Input placeholder="Seu Apelido" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} disabled={isLoading} />
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
              <FormLabel>Palavra-passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                        Aceito os <a href="#" className="underline">termos e condições</a>
                    </FormLabel>
                     <FormMessage />
                </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A processar...
            </>
          ) : (
            <>
              Registar <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}