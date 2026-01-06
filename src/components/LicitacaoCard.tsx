import { Licitacao } from '@/types/licitacao';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Building2, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LicitacaoCardProps {
  licitacao: Licitacao;
  onView: (id: string) => void;
}

export function LicitacaoCard({ licitacao, onView }: LicitacaoCardProps) {
  const dataAbertura = new Date(licitacao.data_hora_abertura);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground truncate">
                {licitacao.numero_edital}
              </span>
              <StatusBadge status={licitacao.status} />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{licitacao.orgao}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {format(dataAbertura, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {licitacao.objeto_resumido || licitacao.objeto}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {licitacao.modalidade}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(licitacao.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
