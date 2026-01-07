import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Licitacao, LicitacaoStatus } from '@/types/licitacao';
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

interface DetalheLicitacaoProps {
  getLicitacaoById: (id: string) => Licitacao | undefined;
  onUpdate: (id: string, updates: Partial<Licitacao>) => void;
  onStatusChange: (id: string, status: LicitacaoStatus) => void;
  onDelete: (id: string) => void;
}

export function DetalheLicitacao({ 
  getLicitacaoById, 
  onUpdate, 
  onStatusChange,
  onDelete 
}: DetalheLicitacaoProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [licitacao, setLicitacao] = useState<Licitacao | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      const data = getLicitacaoById(id);
      if (data) {
        setLicitacao(data);
      } else {
        navigate('/');
      }
    }
  }, [id, getLicitacaoById, navigate]);

  if (!licitacao) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleChange = (updates: Partial<Licitacao>) => {
    setLicitacao(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = () => {
    if (id && licitacao) {
      onUpdate(id, licitacao);
      toast.success('Licitação atualizada com sucesso!');
    }
  };

  const handleStatusChange = (status: LicitacaoStatus) => {
    if (id) {
      onStatusChange(id, status);
      setLicitacao(prev => prev ? { ...prev, status } : null);
      toast.success('Status atualizado!');
    }
  };

  const handleDelete = () => {
    if (id) {
      onDelete(id);
      toast.success('Licitação excluída!');
      navigate('/');
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
              {licitacao.numero_edital}
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
