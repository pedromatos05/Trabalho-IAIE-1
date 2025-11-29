import { Logo } from '@/components/logo';
import { ClientLoginForm } from '@/components/client-login-form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function ClientLoginPage() {
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
          <h2 className="font-headline text-3xl font-bold mb-2">Aceder à Conta</h2>
          <p className="text-muted-foreground mb-8">
            Faça login para aceder à sua conta e começar a comprar.
          </p>
          <ClientLoginForm />
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/store/register" className="text-primary hover:underline">
                Registe-se aqui.
              </Link>
            </p>
             <Link href="/store" passHref>
                <span className="text-sm text-primary hover:underline mt-4 inline-block">
                    ou continuar como convidado
                </span>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white max-w-md">
          <h3 className="font-headline text-4xl font-bold">
            Junte-se à Comunidade.
          </h3>
          <p className="mt-4 text-lg opacity-80">
            Crie a sua conta para desbloquear recompensas, guardar as suas preferências e muito mais.
          </p>
        </div>
      </div>
    </div>
  );
}
