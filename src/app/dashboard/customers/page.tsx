
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { customers } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function CustomersPage() {
  const getCustomerInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    if (name) {
      return name[0];
    }
    return '??';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Customers</CardTitle>
        <CardDescription>
          Manage your customers and view their data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>SAP ID</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={customer.avatarUrl} alt={customer.firstName + ' ' + customer.lastName} />
                      <AvatarFallback>{getCustomerInitials(customer.firstName + ' ' + customer.lastName)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{customer.email}</div>
                  <div className="text-sm text-muted-foreground">NIF: {customer.nif}</div>
                </TableCell>
                <TableCell>
                  {customer.sap_id ? (
                    <Badge variant="secondary">{customer.sap_id}</Badge>
                  ) : (
                    <Badge variant="outline">Not Synced</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(customer.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right font-mono">{customer.points_saldo.toLocaleString('de-DE')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
