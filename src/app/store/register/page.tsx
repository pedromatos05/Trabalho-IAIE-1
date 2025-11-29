import { Logo } from '@/components/logo';
import { ClientRegisterForm } from '@/components/client-register-form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function ClientRegisterPage() {
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
        <div className="w-full max-w-sm">
          <h2 className="font-headline text-3xl font-bold mb-2">Criar Nova Conta</h2>
          <p className="text-muted-foreground mb-8">
            Junte-se à nossa comunidade para começar a ganhar pontos e a comprar.
          </p>
          <ClientRegisterForm />
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/store/login" className="text-primary hover:underline">
                Faça login aqui.
              </Link>
            </p>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white max-w-md">
          <h3 className="font-headline text-4xl font-bold">
            Desbloqueie Recompensas Exclusivas.
          </h3>
          <p className="mt-4 text-lg opacity-80">
            Ganhe pontos em cada compra e troque-os por descontos e produtos.
          </p>
        </div>
      </div>
    </div>
  );
}
