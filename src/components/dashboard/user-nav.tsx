'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';

export function UserNav() {
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 text-left h-auto"
        >
          <Avatar className="h-8 w-8">
            {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="Admin" />}
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="truncate group-data-[collapsible=icon]:hidden">
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={state === 'collapsed' ? 'center' : 'end'}
        side="right"
        sideOffset={12}
      >
        <DropdownMenuLabel>A Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2" />
          <span>Definições</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
