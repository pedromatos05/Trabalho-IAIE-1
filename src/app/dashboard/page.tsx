'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Euro, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  // Estados para guardar os dados que vêm da API
  const [stats, setStats] = useState({
    totalRevenue: 0,
    recentSales: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para ir buscar os dados reais
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        
        // Atualiza o estado com os dados do Moloni/n8n
        setStats({
          totalRevenue: data.totalRevenue || 0,
          recentSales: data.recentSales || []
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Dashboard
      </h1>

      {/* Cartão de Receita Total */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total (Moloni)
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `€${Number(stats.totalRevenue).toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor acumulado real
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Placeholder do Gráfico */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Gráfico de vendas</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                {loading ? <Loader2 className="animate-spin" /> : "Gráfico aguardando dados..."}
             </div>
          </CardContent>
        </Card>

        {/* Lista de Vendas Recentes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Últimas vendas sincronizadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="space-y-8">
                {stats.recentSales.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem vendas recentes.</p>
                ) : (
                  stats.recentSales.map((sale: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {sale.customer_name ? sale.customer_name.charAt(0) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.customer_name || 'Cliente Desconhecido'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.email || 'Sem email'}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +€{Number(sale.net_value || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}