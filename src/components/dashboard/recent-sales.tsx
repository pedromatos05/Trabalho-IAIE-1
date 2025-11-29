import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { orders, customers } from '@/lib/data';

export function RecentSales() {
  const recentOrders = orders.slice(0, 5);

  const getCustomerAvatar = (email: string) => {
    const customer = customers.find(c => c.email === email);
    return customer ? customer.avatarUrl : 'https://picsum.photos/seed/fallback/100/100';
  };

  const getCustomerInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name[0];
  }

  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div className="flex items-center" key={order.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={getCustomerAvatar(order.customerEmail)} alt="Avatar" />
            <AvatarFallback>{getCustomerInitials(order.customerName)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {order.customerEmail}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +€{order.total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      ))}
    </div>
  );
}
