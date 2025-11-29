import Image from 'next/image';
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
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/data';

export default function InventoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Inventory</CardTitle>
        <CardDescription>
          Real-time stock levels synchronized from Moloni.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-right">Moloni Stock</TableHead>
              <TableHead className="text-right">Online Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.imageUrl}
                    width="64"
                    data-ai-hint={product.imageHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.genre}</Badge>
                </TableCell>
                <TableCell className="text-right">{product.stock_moloni}</TableCell>
                <TableCell className={`text-right font-semibold ${product.stock_online < 5 ? 'text-destructive' : ''}`}>
                  {product.stock_online}
                </TableCell>
                <TableCell className="text-right">
                  €{product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
