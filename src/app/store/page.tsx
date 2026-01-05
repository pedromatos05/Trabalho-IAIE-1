
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { ShoppingCart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function StorePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'login-hero');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const genres = [...new Set(products.map((p) => p.genre))];

  const filteredProducts = activeFilter
    ? products.filter((p) => p.genre === activeFilter)
    : products;

  return (
    <>
      <section className="relative h-[560px] flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover object-top opacity-20"
            data-ai-hint={heroImage.imageHint}
            priority
            unoptimized={true}
          />
        )}
        <div className="relative z-10 p-6 max-w-3xl mx-auto">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-purple-400 to-red-400 text-transparent bg-clip-text">
            Games Paradise - O Paraíso dos Gamers
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore os nossos títulos mais recentes e populares. É necessário
            registar-se para comprar.
          </p>
        </div>
      </section>

      <div className="p-6 md:p-12">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
             variant={activeFilter === null ? 'secondary' : 'outline'}
             onClick={() => setActiveFilter(null)}
          >
            Todos
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={activeFilter === genre ? 'secondary' : 'outline'}
              onClick={() => setActiveFilter(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/store/products/${product.id}`}
              passHref
            >
              <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group h-full cursor-pointer">
                <div className="relative h-96 w-full">
                  <Image
                    alt={product.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.imageUrl}
                    fill
                    data-ai-hint={product.imageHint}
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="font-headline text-xl font-semibold mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.genre}
                  </p>
                  <div className="flex-grow"></div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-bold text-primary">
                      €
                      {product.price.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <Button variant="secondary" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.genre === 'Gift Card'
                        ? 'Ver Cartão'
                        : 'Ver Jogo'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
