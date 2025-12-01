'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TicketPercent, Trophy, Minus, Plus, Star, Loader2 } from 'lucide-react'; // Adicionei Loader2
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, total, clearCart, updateQuantity } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  // 1. O addPoints e spendPoints agora são assíncronos (Promises)
  const { user, loading, addPoints, spendPoints } = useAuth();
  
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);
  // 2. Novo estado para bloquear o botão durante o processamento
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        variant: 'destructive',
        title: 'Login Necessário',
        description: 'Por favor, faça login para finalizar a sua compra.',
      });
      router.push('/store/login');
    }
  }, [user, loading, router, toast]);

  const pointsToUseForDiscount = 100;
  const discountFromPoints = usePointsDiscount && user && user.points_saldo >= pointsToUseForDiscount ? total * 0.20 : 0;
  
  const finalTotal = total - discountFromPoints;
  const pointsToGain = Math.floor(finalTotal);

  // 3. A função agora é ASYNC para esperar pelo Supabase
  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setIsProcessing(true); // Bloqueia o botão

    try {
        let pointsSpent = 0;

        // 3.1. Calcular custo em pontos (Produtos)
        const pointsItems = cart.filter(item => item.isPointsPurchase);
        if (pointsItems.length > 0) {
            const totalPointsCost = pointsItems.reduce((acc, item) => acc + Math.floor(item.product.price * 50), 0);
            if (user.points_saldo >= totalPointsCost) {
                pointsSpent += totalPointsCost;
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro na Compra',
                    description: 'Pontos insuficientes para os itens selecionados.',
                });
                setIsProcessing(false);
                return; 
            }
        }
        
        // 3.2. Calcular custo em pontos (Desconto)
        if (usePointsDiscount) {
            pointsSpent += pointsToUseForDiscount;
        }

        // 3.3. Executar transações (AWAIT é crucial aqui)
        // Primeiro gastamos os pontos
        if (pointsSpent > 0) {
            await spendPoints(pointsSpent);
        }
        
        // Depois damos os pontos novos (se houver)
        if (pointsToGain > 0) {
            await addPoints(pointsToGain);
        }
        
        // 4. Sucesso!
        toast({
            title: 'Compra Realizada!',
            description: `Obrigado pela sua compra. Ganhou ${pointsToGain} pontos!`,
        });
        
        clearCart();
        router.push('/store/account/orders');

    } catch (error) {
        console.error("Erro no checkout:", error);
        toast({
            variant: 'destructive',
            title: 'Erro ao processar',
            description: 'Ocorreu um erro ao comunicar com o servidor. Tente novamente.',
        });
    } finally {
        setIsProcessing(false); // Desbloqueia o botão (se algo falhar)
    }
  };
  
  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
            <p>A verificar autenticação...</p>
        </div>
    );
  }
  
  const hasPointsPurchase = cart.some(item => item.isPointsPurchase);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Finalizar Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informação do Cliente</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue={`${user.name}`} disabled /> {/* Ajustei para user.name */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input id="address" placeholder="Insira a sua morada..." />
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Método de Pagamento</h3>
                <RadioGroup defaultValue="credit-card" className="space-y-2">
                  <Label className="flex items-center gap-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <span>Cartão de Crédito</span>
                  </Label>
                  <Label className="flex items-center gap-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                      <span>PayPal</span>
                  </Label>
                  <Label className="flex items-center gap-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                    <RadioGroupItem value="mbway" id="mbway" />
                    <span>MB Way</span>
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length > 0 ? cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Ajusta o src da imagem se necessário */}
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                         <Image 
                            src={item.product.imageUrl || '/placeholder.png'} 
                            alt={item.product.name} 
                            fill
                            className="object-cover"
                         />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        {item.isPointsPurchase ? (
                            <p className="text-sm font-bold text-primary flex items-center gap-1">
                                <Star className="size-4" /> Comprado com Pontos
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">€{item.product.price.toFixed(2)} x {item.quantity}</p>
                        )}
                         <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.isPointsPurchase || isProcessing}>
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                             <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.isPointsPurchase || isProcessing}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)} disabled={isProcessing}>Remover</Button>
                  </div>
                )) : <p className="text-muted-foreground text-sm">O seu carrinho está vazio.</p>}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {discountFromPoints > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Desconto de Pontos</span>
                    <span>-€{discountFromPoints.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full" onClick={handlePlaceOrder} disabled={cart.length === 0 || isProcessing}>
                  {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                      </>
                  ) : (
                      "Confirmar e Pagar"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Trophy />
                        Usar Recompensas
                    </CardTitle>
                    <CardDescription>
                        Você tem <span className="font-bold text-primary">{user.points_saldo.toLocaleString('de-DE')}</span> pontos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant={user.points_saldo >= pointsToUseForDiscount ? 'default' : 'destructive'} className={`${user.points_saldo >= pointsToUseForDiscount ? 'bg-accent/30 border-primary/40' : 'bg-muted/30'}`}>
                        <TicketPercent className="h-4 w-4" />
                        <AlertTitle>20% de desconto</AlertTitle>
                        <AlertDescription>Requer {pointsToUseForDiscount} pontos.</AlertDescription>
                    </Alert>
                    
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <Label htmlFor="use-points" className="font-medium flex-1 pr-4">
                            Aplicar 20% de desconto por {pointsToUseForDiscount} pontos?
                        </Label>
                        <Switch
                            id="use-points"
                            checked={usePointsDiscount}
                            onCheckedChange={setUsePointsDiscount}
                            disabled={user.points_saldo < pointsToUseForDiscount || total === 0 || hasPointsPurchase || isProcessing}
                        />
                    </div>
                     {hasPointsPurchase && <p className="text-xs text-amber-500">O desconto de 20% não pode ser combinado com uma compra direta por pontos.</p>}
                     <p className="text-xs text-muted-foreground">Outras recompensas podem ser resgatadas na <Link href="/store/points" className="underline">Loja de Pontos</Link>.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}