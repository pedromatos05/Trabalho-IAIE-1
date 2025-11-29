
'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, LogIn, ShoppingCart, LogOut, Package, CircleUser, Trophy, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, loading, logout } = useAuth();
  const { cart, removeFromCart, total, updateQuantity, cartCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  return (
    <header className="flex items-center justify-between p-4 px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <Link href="/store" className="flex items-center gap-2">
        <Logo />
        <span className="font-headline text-lg font-semibold">Games Paradise</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/store/points">
            <Trophy className="h-4 w-4" />
            <span className="sr-only">Loja de Pontos</span>
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle>O seu Carrinho</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground">O seu carrinho está vazio.</p>
              ) : (
                <ul role="list" className="-my-6 divide-y divide-border">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-foreground">
                            <h3>
                              <a href={`/store/products/${item.product.id}`}>{item.product.name}</a>
                            </h3>
                            <p className="ml-4">€{item.product.price.toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.product.genre}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                           <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="font-medium text-primary hover:text-primary/80"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
             <SheetFooter className="border-t border-border pt-6">
                <div className="w-full">
                    <div className="flex justify-between text-base font-medium text-foreground">
                        <p>Subtotal</p>
                        <p>€{total.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">Portes e taxas calculados no checkout.</p>
                    <div className="mt-6">
                        <Button asChild className="w-full" disabled={cart.length === 0}>
                           <Link href="/store/checkout">Finalizar Compra</Link>
                        </Button>
                    </div>
                    <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                        <p>
                            ou{' '}
                            <SheetTrigger asChild>
                              <button className="font-medium text-primary hover:text-primary/80">
                                  Continuar a comprar
                                  <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </SheetTrigger>
                        </p>
                    </div>
                </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {loading ? (
           <Button variant="ghost" disabled>
             <User className="mr-2" />
             ...
            </Button>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <User className="mr-2" />
                A Minha Conta
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user.firstName} {user.lastName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/store/account/profile">
                    <CircleUser className="mr-2" />
                    <span>O Meu Perfil</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/store/account/orders">
                  <Package className="mr-2" />
                  <span>Encomendas</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/store/points">
                    <Trophy className="mr-2" />
                    <span>Loja de Pontos</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild>
                <Link href="/store/login">
                    <LogIn className="mr-2" />
                    Login
                </Link>
            </Button>
            <Button asChild>
                <Link href="/store/register">
                    Registar
                </Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
