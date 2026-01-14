'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Interface ajustada aos teus dados
interface Supplier {
  supplier_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  contact_name: string | null;
  vat: string;
}

export default function SuppliersPage() {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        // ⚠️ Confirma se este URL é o correto do teu Webhook n8n
        const response = await fetch('http://193.136.11.144:5609/webhook/39abb207-3d72-411f-8f4f-bd96f2cdfb64'); 
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const json = await response.json();
        console.log("Dados recebidos do n8n:", json); // Isto vai ajudar a veres o formato na consola do browser

        // LÓGICA DE PROTEÇÃO PARA O ERRO "MAP IS NOT A FUNCTION"
        if (Array.isArray(json)) {
          // Caso 1: O n8n enviou a lista direta [...]
          setData(json);
        } else if (json.data && Array.isArray(json.data)) {
          // Caso 2: O n8n enviou { "data": [...] }
          setData(json.data);
        } else if (json.json && Array.isArray(json.json)) {
             // Caso 3: O n8n enviou { "json": [...] }
             setData(json.json);
        } else {
          console.error("Formato de dados desconhecido:", json);
          setData([]); // Evita que a página parta se o formato for estranho
        }

      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        setData([]); // Garante que data é sempre um array, mesmo com erro
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Suppliers</CardTitle>
        <CardDescription>
          Manage your product suppliers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>VAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  A carregar dados...
                </TableCell>
              </TableRow>
            ) : (
              // Verificação extra para garantir que data existe e tem tamanho
              data.length > 0 ? (
                data.map((supplier) => (
                  <TableRow key={supplier.supplier_id}>
                    <TableCell className="font-medium">
                        {supplier.name}
                    </TableCell>
                    <TableCell>
                        {supplier.contact_name || <span className="text-muted-foreground italic">Sem contacto</span>}
                    </TableCell>
                    <TableCell>
                      <div>{supplier.email || '-'}</div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.phone || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                        {supplier.vat}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}