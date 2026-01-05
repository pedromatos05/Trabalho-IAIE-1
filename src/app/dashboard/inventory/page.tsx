'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackagePlus, Loader2, RefreshCw } from 'lucide-react';
import { products as initialProducts } from '@/lib/data';

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados do Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. CARREGAR STOCK AO INICIAR
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 A atualizar lista de stock...");
      
      const res = await fetch('/api/get-stock');
      const data = await res.json();

      // O n8n envia { "lista_final": [ ... ] }
      // Se der erro ou vier vazio, assumimos lista vazia []
      const realStockData = data.lista_final || [];

      console.log("✅ Stock recebido (n8n):", realStockData);

      if (Array.isArray(realStockData)) {
        setInventory(currentInventory => 
          currentInventory.map(item => {
            // Compara os IDs (convertendo para String para evitar erros de tipo)
            const moloniItem = realStockData.find((m: any) => String(m.product_id) === String(item.moloni_id));
            
            if (moloniItem) {
              // Se encontrar, atualiza o stock local com o valor real
              return { ...item, stock_moloni: moloniItem.stock };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error("❌ Erro ao sincronizar stock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openStockModal = (product: any) => {
    setSelectedProduct(product);
    setAmountToAdd('');
    setIsDialogOpen(true);
  };

  // 2. ENVIAR ATUALIZAÇÃO (ADD STOCK)
  const handleAddStock = async () => {
    // --- Validações ---
    if (!selectedProduct || !amountToAdd) {
      alert("Por favor selecione um produto e insira uma quantidade.");
      return;
    }

    if (!selectedProduct.moloni_id) {
      alert(`Erro: O produto "${selectedProduct.name}" não tem ID do Moloni configurado no ficheiro data.ts.`);
      return;
    }

    const amount = parseInt(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      alert("A quantidade deve ser um número maior que 0.");
      return;
    }

    setIsSaving(true);

    try {
      console.log(`📤 A enviar: ${selectedProduct.name} | ID=${selectedProduct.moloni_id} | Qty=${amount}`);

      // Chama a nossa API local
      const response = await fetch('/api/update-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.moloni_id,
          qty: amount,
          // --- NOVOS DADOS ENVIADOS ---
          name: selectedProduct.name,
          price: selectedProduct.price
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Erro na API (${response.status}): ${errorDetails}`);
      }

      // Sucesso!
      setIsDialogOpen(false);
      setAmountToAdd('');
      
      // Atualiza a tabela para garantir que vemos o valor novo
      await fetchStock(); 
      
      alert(`Stock de ${selectedProduct.name} atualizado com sucesso!`);

    } catch (error: any) {
      console.error("❌ Erro no envio:", error);
      alert(error.message || "Erro ao comunicar com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Inventory</CardTitle>
              <CardDescription>Sincronização em tempo real com Moloni via n8n.</CardDescription>
            </div>
            {/* Botão de Refresh Manual */}
            <Button variant="ghost" size="icon" onClick={fetchStock} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Image</span></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Moloni Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="relative h-16 w-16">
                      <Image 
                        alt={product.name} 
                        className="aspect-square rounded-md object-cover" 
                        fill 
                        src={product.imageUrl} 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><Badge variant="outline">{product.genre}</Badge></TableCell>
                  
                  {/* Célula de Stock com Loading State */}
                  <TableCell className="text-right font-bold">
                    {isLoading ? (
                      <span className="text-muted-foreground text-xs animate-pulse">...</span>
                    ) : (
                      product.stock_moloni
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    € {product.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openStockModal(product)}>
                      <PackagePlus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL DE ADICIONAR STOCK */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Stock</DialogTitle>
            <DialogDescription>
              A inserir movimento de entrada para <strong>{selectedProduct?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock-amount" className="text-right">Quantidade</Label>
              <Input
                id="stock-amount"
                type="number"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                className="col-span-3"
                placeholder="Ex: 5"
                min="1"
                disabled={isSaving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleAddStock} disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A Enviar...</> : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}