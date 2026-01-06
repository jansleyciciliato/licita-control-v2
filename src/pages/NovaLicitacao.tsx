import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Licitacao } from '@/types/licitacao';
import { toast } from 'sonner';

interface NovaLicitacaoProps {
  onAdd: (licitacao: Omit<Licitacao, 'id' | 'data_cadastro' | 'status'>) => Licitacao;
}

export function NovaLicitacao({ onAdd }: NovaLicitacaoProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    
    try {
      // Simulate backend processing - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - in production, this comes from Python backend
      const extractedData: Omit<Licitacao, 'id' | 'data_cadastro' | 'status'> = {
        numero_edital: `PE ${String(Math.floor(Math.random() * 100)).padStart(3, '0')}/2024`,
        numero_processo: `2024.${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}.001`,
        orgao: 'Órgão extraído do documento',
        modalidade: 'Pregão Eletrônico',
        tipo_disputa: 'Aberto',
        registro_preco: true,
        tipo_lances: 'Fechado',
        data_abertura: new Date().toISOString().split('T')[0],
        data_hora_abertura: new Date().toISOString(),
        objeto: 'Objeto completo extraído do edital pelo processamento de IA...',
        objeto_resumido: 'Objeto resumido',
        documentos_habilitacao: {},
        itens: [
          {
            lote: '1',
            item: '1',
            descricao: 'Item extraído do documento',
            unidade: 'UN',
            quantidade: 100,
            valor_estimado: 50.00,
          },
        ],
      };

      const newLicitacao = onAdd(extractedData);
      toast.success('Licitação cadastrada com sucesso!');
      navigate(`/licitacao/${newLicitacao.id}`);
    } catch (error) {
      toast.error('Erro ao processar documentos. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova Licitação</h1>
          <p className="text-muted-foreground">
            Faça upload dos documentos para processamento
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Faça upload do Edital, Termo de Referência e Anexos em formato PDF. 
          Os documentos serão processados automaticamente para extração de dados.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Documentos</CardTitle>
          <CardDescription>
            Arraste ou selecione os arquivos PDF da licitação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload onProcess={handleProcess} isProcessing={isProcessing} />
        </CardContent>
      </Card>
    </div>
  );
}
