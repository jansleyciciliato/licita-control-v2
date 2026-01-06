import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Loader2, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Licitacao } from '@/types/licitacao';
import { toast } from 'sonner';

interface NovaLicitacaoProps {
  onAdd: (licitacao: Omit<Licitacao, 'id' | 'data_cadastro' | 'status'>) => Licitacao;
}

export function NovaLicitacao({ onAdd }: NovaLicitacaoProps) {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um documento PDF.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Preparar FormData com os arquivos
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Enviar para o backend Python
      const response = await fetch('/api/upload-pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao processar documentos');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Erro ao processar documentos');
      }

      const extractedData = data.extraido ?? data.licitacao;

      // Preparar dados extraídos para criação
      const licitacaoData: Omit<Licitacao, 'id' | 'data_cadastro' | 'status'> = {
        numero_edital: extractedData.numero_edital || null,
        numero_processo: extractedData.numero_processo || null,
        orgao: extractedData.orgao || null,
        modalidade: extractedData.modalidade || null,
        tipo_disputa: extractedData.tipo_disputa || null,
        registro_preco: extractedData.registro_preco || false,
        tipo_lances: extractedData.tipo_lances || null,
        data_abertura: extractedData.data_abertura || null,
        data_hora_abertura: extractedData.data_hora_abertura || null,
        objeto: extractedData.objeto || null,
        objeto_resumido: extractedData.objeto_resumido || null,
        documentos_habilitacao: extractedData.documentos_habilitacao || {},
        itens: extractedData.itens || [],
      };

      // Criar licitação com dados extraídos
      const newLicitacao = onAdd(licitacaoData);
      
      toast.success('Licitação cadastrada com sucesso!');
      navigate(`/licitacao/${newLicitacao.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao processar';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} disabled={isProcessing}>
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
        <CardContent className="space-y-6">
          <FileUpload
            files={files}
            onFilesChange={setFiles}
            disabled={isProcessing}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Processar Documentos
                </>
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="bg-accent/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Extraindo informações dos documentos via IA...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Isso pode levar alguns segundos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}