import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { customers, orders, products } from '@/lib/data';
import { DollarSign, ShoppingCart, Users, Archive } from 'lucide-react';

export function OverviewStats() {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSales = orders.length;
  const newCustomers = customers.length;
  const lowStockItems = products.filter(
    (product) => product.stock_online < 5
  ).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `€${totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: '+20.1% from last month',
    },
    {
      title: 'Sales',
      value: `+${totalSales}`,
      icon: ShoppingCart,
      description: '+180.1% from last month',
    },
    {
      title: 'New Customers',
      value: `+${newCustomers}`,
      icon: Users,
      description: '+19% from last month',
    },
    {
      title: 'Low Stock',
      value: `${lowStockItems}`,
      icon: Archive,
      description: 'Items with less than 5 units',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
