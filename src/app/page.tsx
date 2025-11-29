
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, User, Shield } from 'lucide-react';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'login-hero');

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-card relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Logo className="size-8" />
          <h1 className="font-headline text-xl font-semibold">
            Games Paradise
          </h1>
        </div>
        <div className="w-full max-w-sm text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">Games Paradise</h2>
          <p className="text-muted-foreground mb-10">
            O seu destino final para os melhores jogos. Explore a nossa coleção ou gira a sua loja.
          </p>
          <div className="grid grid-cols-1 gap-4">
             <Link href="/store/login" passHref>
              <Button size="lg" className="w-full">
                <User className="mr-2" />
                Entrar como Cliente
                <ArrowRight className="ml-auto" />
              </Button>
            </Link>
            <Link href="/admin/login" passHref>
              <Button size="lg" variant="outline" className="w-full">
                <Shield className="mr-2" />
                Entrar como Administrador
                <ArrowRight className="ml-auto" />
              </Button>
            </Link>
             <Link href="/store" passHref>
                <Button size="lg" variant="link" className="w-full mt-4">
                    Ver Loja como Convidado
                    <ArrowRight className="ml-2" />
                </Button>
            </Link>
          </div>
        </div>
        <footer className="absolute bottom-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Games Paradise. All rights reserved.
        </footer>
      </div>
      <div className="w-1/2 relative">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white max-w-lg">
          <h3 className="font-headline text-4xl font-bold">
            Descubra novos mundos, enfrente desafios épicos e junte-se a uma comunidade de jogadores.
          </h3>
        </div>
      </div>
    </div>
  );
}
