
'use client';

import { products, type Product } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  if (!product) {
    notFound();
  }

  const pointsCost = Math.floor(product.price * 50);
  const hasEnoughPoints = user ? user.points_saldo >= pointsCost : false;
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
        title: "Adicionado ao carrinho",
        description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  };

  const handleBuyWithPoints = (product: Product) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Login Necessário",
            description: "Precisa de fazer login para comprar com pontos.",
        });
        router.push('/store/login');
        return;
    }
    if (hasEnoughPoints) {
        addToCart(product, true);
        toast({
            title: "Item adicionado!",
            description: `${product.name} foi adicionado ao carrinho para comprar com pontos.`,
        });
        router.push('/store/checkout');
    } else {
         toast({
            variant: "destructive",
            title: "Pontos Insuficientes",
            description: `Você não tem pontos suficientes para comprar ${product.name}.`,
        });
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
            <Card>
                <CardContent className="relative aspect-[3/4] flex items-center justify-center p-0 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </CardContent>
            </Card>
        </div>
        <div>
          <Badge variant="outline">{product.genre}</Badge>
          <h1 className="font-headline text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-4xl font-bold text-primary mt-4">
            €{product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-lg text-amber-400 font-semibold flex items-center gap-2 mt-2">
            <Star className="size-5" /> Custa {pointsCost.toLocaleString('de-DE')} Pontos
          </p>
          <Separator className="my-6" />
          <p className="text-muted-foreground">{product.description}</p>
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row gap-4">
             <Button size="lg" onClick={() => handleAddToCart(product)} className="flex-1">
                <ShoppingCart className="mr-2" />
                Adicionar ao Carrinho
            </Button>
            <Button 
                size="lg" 
                variant="secondary" 
                className="flex-1"
                onClick={() => handleBuyWithPoints(product)}
                disabled={!user || !hasEnoughPoints}
                title={!user ? "Faça login para usar pontos" : !hasEnoughPoints ? `Pontos insuficientes. Saldo atual: ${user?.points_saldo}` : `Comprar com ${pointsCost} pontos`}
            >
                <Star className="mr-2" />
                Comprar com Pontos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
