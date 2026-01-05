'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trophy, Edit, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'O primeiro nome é obrigatório.'),
  lastName: z.string().min(1, 'O apelido é obrigatório.'),
  nickname: z.string().optional(),
  email: z.string().email(),
  nif: z.string().min(9, 'O NIF deve ter 9 dígitos.').max(9, 'O NIF deve ter 9 dígitos.'),
  address: z.string().min(1, 'A morada é obrigatória.'),
  postalCode: z.string().min(1, 'O código postal é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      nif: '',
      address: '',
      postalCode: '',
      city: '',
    },
  });

  // Este useEffect garante que os campos são preenchidos assim que os dados do user chegam
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        nickname: user.nickname || '',
        email: user.email || '',
        nif: user.nif || '',
        address: user.address || '',
        postalCode: user.postalCode || '',
        city: user.city || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/atualizar-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const updatedUserData = { ...user, ...data };
        updateUser(updatedUserData);
        setIsEditing(false);
        
        toast({
          title: 'Perfil Atualizado!',
          description: 'As suas informações foram sincronizadas com o SAP com sucesso.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro na Atualização',
          description: result.mensagem || 'Ocorreu um erro ao comunicar com o SAP.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Rede',
        description: 'Não foi possível contactar o servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">O Meu Perfil</CardTitle>
                <CardDescription>
                  Veja e atualize as suas informações pessoais.
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="icon" type="button" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Perfil</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primeiro Nome</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} placeholder="Introduza o primeiro nome" />
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
                        <Input {...field} readOnly={!isEditing} placeholder="Introduza o apelido" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcunha (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} placeholder="Como quer ser chamado" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted text-muted-foreground cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} placeholder="Rua, número e porta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} placeholder="0000-000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} placeholder="Cidade" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} placeholder="9 dígitos" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Membro Desde</Label>
                  <Input 
                    value={user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'} 
                    readOnly 
                    className="bg-muted text-muted-foreground"
                  />
                </div>
              </div>
            </CardContent>
            
            {isEditing && (
              <CardFooter className="justify-end space-x-2 border-t pt-6">
                <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar Alterações
                </Button>
              </CardFooter>
            )}
          </Card>
        </form>
      </Form>

      {/* Restante UI (Pontos/Recompensas) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Recompensas de Pontos
          </CardTitle>
          <CardDescription>
            Use os seus pontos para resgatar recompensas exclusivas na nossa Loja de Pontos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/store/points">Ir para a Loja de Pontos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}