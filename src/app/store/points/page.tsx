'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { customers } from '@/lib/data';
import { Gift, TicketPercent, Trophy, Star, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function PointsStorePage() {
  const { user, loading } = useAuth();

  const pointTiers = [
    { points: 100, reward: "20% de desconto numa compra", icon: TicketPercent },
    { points: 500, reward: "Cartão Paysafe de 10€ grátis", icon: Gift },
    { points: 1000, reward: "1 Jogo grátis à sua escolha (até 40€)", icon: Trophy },
    { points: 2500, reward: "50€ Saldo na loja", icon: Star},
  ];

  const points = user ? user.points_saldo : 0;
  const nextTier = pointTiers.find(tier => points < tier.points);
  const progressToNextTier = nextTier ? (points / nextTier.points) * 100 : 100;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
            <h1 className="font-headline text-5xl font-bold tracking-tight mb-2">
                Loja de Pontos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bem-vindo ao seu centro de recompensas! Use os seus pontos para resgatar prémios fantásticos.
            </p>
        </div>
        
        {!user && !loading && (
            <Card className="mb-8 text-center p-8">
                <CardHeader>
                    <CardTitle className="font-headline">Aceda para ver os seus pontos</CardTitle>
                    <CardDescription>Para acumular e resgatar pontos, precisa de ter uma conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/store/login">
                            <LogIn className="mr-2" />
                            Fazer Login ou Registar
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )}

        {user && (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Trophy className="size-8 text-primary" />
                        O Seu Saldo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-6xl font-bold text-primary mb-4">{points.toLocaleString('de-DE')} Pontos</p>
                    {nextTier && (
                        <div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                <span>O seu progresso para a próxima recompensa:</span>
                                <span>{points} / {nextTier.points}</span>
                            </div>
                            <Progress value={progressToNextTier} className="h-2" />
                            <p className="text-xs text-right mt-1 text-muted-foreground">Faltam {nextTier.points - points} pontos para "{nextTier.reward}"</p>
                        </div>
                    )}
                    {points >= 2500 && (
                        <p className="text-sm text-green-400 mt-2">Parabéns! Alcançou todas as recompensas disponíveis!</p>
                    )}
                </CardContent>
            </Card>
        )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pointTiers.map(tier => {
          const available = user ? points >= tier.points : false;
          return (
            <Card key={tier.points} className={`flex flex-col ${available ? 'border-primary/50' : 'border-dashed'}`}>
              <CardHeader className="text-center items-center">
                <div className={`p-4 rounded-full mb-4 ${available ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <tier.icon className="size-8" />
                </div>
                <CardTitle className="font-headline text-2xl">{tier.reward}</CardTitle>
                <CardDescription className="font-bold text-lg text-primary flex items-center gap-2">
                  <Star className="size-4" /> {tier.points.toLocaleString('de-DE')} Pontos
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-muted-foreground text-sm">
                  {user && available 
                      ? "Você tem pontos suficientes para resgatar esta recompensa!" 
                      : `Continue a acumular pontos para desbloquear este prémio incrível.`
                  }
                   {!user && `Faça login para poder resgatar.`}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!available}>
                  {available ? 'Resgatar Agora' : 'Pontos Insuficientes'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
