import { Header } from './header';
import { AuthProvider } from '@/hooks/use-auth';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="bg-background min-h-screen">
        <Header />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
