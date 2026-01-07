import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LicitacaoForm } from '@/components/LicitacaoForm';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLicitacoes } from '@/hooks/useLicitacoes';
import { normalizarLicitacao } from '@/utils/safeValues';
import type { Tables } from '@/integrations/supabase/types';

type Licitacao = Tables<'licitacoes'>;
type LicitacaoStatus = Licitacao['status'];

// Componente agora não recebe props, usa o hook diretamente
export function DetalheLicitacao() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchLicitacaoById, updateLicitacao, deleteLicitacao, loading } = useLicitacoes();
  
  const [licitacao, setLicitacao] = useState<Licitacao | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    async function carregarLicitacao() {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoadingDetail(true);
        const data = await fetchLicitacaoById(id);
        
        if (data) {
          // Normalizar dados para evitar erros com campos null
          const licitacaoNormalizada = normalizarLicitacao(data);
          setLicitacao(licitacaoNormalizada);
        } else {
          toast.error('Licitação não encontrada');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao carregar licitação:', error);
        toast.error('Erro ao carregar licitação');
        navigate('/');
      } finally {
        setLoadingDetail(false);
      }
    }

    carregarLicitacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // ✅ APENAS id como dependência

  if (loadingDetail || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!licitacao) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Licitação não encontrada</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleChange = (updates: Partial<Licitacao>) => {
    setLicitacao(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = async () => {
    if (id && licitacao) {
      try {
        const result = await updateLicitacao(id, licitacao);
        if (result) {
          setLicitacao(result);
          toast.success('Licitação atualizada com sucesso!');
        } else {
          toast.error('Erro ao atualizar licitação');
        }
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toast.error('Erro ao salvar alterações');
      }
    }
  };

  const handleStatusChange = async (status: LicitacaoStatus) => {
    if (id) {
      try {
        const result = await updateLicitacao(id, { status });
        if (result) {
          setLicitacao(prev => prev ? { ...prev, status } : null);
          toast.success('Status atualizado!');
        } else {
          toast.error('Erro ao atualizar status');
        }
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status');
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        const sucesso = await deleteLicitacao(id);
        if (sucesso) {
          toast.success('Licitação excluída!');
          navigate('/');
        } else {
          toast.error('Erro ao excluir licitação');
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        toast.error('Erro ao excluir licitação');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {licitacao.numero_edital || 'Sem número'}
            </h1>
            <StatusBadge status={licitacao.status} />
          </div>
          <p className="text-muted-foreground">{licitacao.orgao}</p>
        </div>
      </div>

      <LicitacaoForm
        licitacao={licitacao}
        onChange={handleChange}
        onSave={handleSave}
        onDelete={() => setShowDeleteDialog(true)}
        onStatusChange={handleStatusChange}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a licitação {licitacao.numero_edital}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}