import { ReactNode } from 'react';
import { FileText, LayoutGrid, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">
                Controle de Licitações
              </span>
              <span className="text-xs text-muted-foreground">
                Gerenciamento de Processos
              </span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              size="sm" 
              asChild
            >
              <Link to="/">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button 
              variant={location.pathname === '/nova' ? 'default' : 'ghost'} 
              size="sm" 
              asChild
            >
              <Link to="/nova">
                <Plus className="h-4 w-4 mr-2" />
                Nova Licitação
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
