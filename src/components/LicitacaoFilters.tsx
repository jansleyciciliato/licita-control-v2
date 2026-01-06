import { LicitacaoStatus, STATUS_CONFIG } from '@/types/licitacao';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LicitacaoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LicitacaoStatus | 'TODOS';
  onStatusFilterChange: (value: LicitacaoStatus | 'TODOS') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

const statusTabs: { value: LicitacaoStatus | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ANALISAR', label: 'Analisar' },
  { value: 'PARTICIPAR', label: 'Participar' },
  { value: 'DESCARTADA', label: 'Descartada' },
  { value: 'VENCEDOR', label: 'Vencedor' },
  { value: 'PERDIDA', label: 'Perdida' },
  { value: 'SUSPENSA', label: 'Suspensa' },
];

export function LicitacaoFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange,
}: LicitacaoFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusFilterChange(tab.value)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por edital, órgão..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as 'asc' | 'desc')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Abertura (mais recentes)</SelectItem>
            <SelectItem value="asc">Abertura (mais antigas)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
