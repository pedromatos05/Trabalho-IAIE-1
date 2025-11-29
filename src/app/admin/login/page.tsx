import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminLoginPage() {
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
          <h2 className="font-headline text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-muted-foreground mb-8">
            Aceda ao seu painel para gerir vendas, stock e clientes.
          </p>
          <LoginForm />
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
            Automação em tempo real para o seu império de jogos.
          </h3>
          <p className="mt-4 text-lg opacity-80">
            Sincronize vendas, stock e dados de clientes de forma transparente.
          </p>
        </div>
      </div>
    </div>
  );
}
