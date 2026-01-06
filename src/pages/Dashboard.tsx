import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Licitacao, LicitacaoStatus } from '@/types/licitacao';
import { LicitacaoCard } from '@/components/LicitacaoCard';
import { LicitacaoFilters } from '@/components/LicitacaoFilters';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

interface DashboardProps {
  licitacoes: Licitacao[];
}

export function Dashboard({ licitacoes }: DashboardProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LicitacaoStatus | 'TODOS'>('TODOS');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLicitacoes = useMemo(() => {
    let result = [...licitacoes];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(l => 
        l.numero_edital.toLowerCase().includes(searchLower) ||
        l.orgao.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'TODOS') {
      result = result.filter(l => l.status === statusFilter);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.data_hora_abertura).getTime();
      const dateB = new Date(b.data_hora_abertura).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [licitacoes, search, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Licitações</h1>
          <p className="text-muted-foreground">
            {licitacoes.length} licitações cadastradas
          </p>
        </div>
        <Button onClick={() => navigate('/nova')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Licitação
        </Button>
      </div>

      <LicitacaoFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {filteredLicitacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            Nenhuma licitação encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== 'TODOS' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando uma nova licitação'}
          </p>
          {!search && statusFilter === 'TODOS' && (
            <Button onClick={() => navigate('/nova')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Licitação
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLicitacoes.map((licitacao) => (
            <LicitacaoCard
              key={licitacao.id}
              licitacao={licitacao}
              onView={(id) => navigate(`/licitacao/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
