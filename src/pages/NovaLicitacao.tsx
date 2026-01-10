import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLicitacoes } from '@/hooks/useLicitacoes';
import { toast } from 'sonner';

interface NovaLicitacaoProps {
  onAdd?: (licitacao: any) => any; // Manter para compatibilidade
}

export function NovaLicitacao({ onAdd }: NovaLicitacaoProps) {
  const navigate = useNavigate();
  const { fetchLicitacaoById } = useLicitacoes();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  // URL do backend - como está no mesmo domínio, usa path relativo
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um documento PDF.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setCurrentStep('Preparando arquivos...');

    try {
      // Passo 1: Preparar FormData
      setProgress(10);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      setCurrentStep('Enviando documentos para o servidor...');
      setProgress(20);

      // Passo 2: Enviar para o backend Python
      console.log('📤 Enviando para:', `${BACKEND_URL}/upload-pdfs`);
      
      const response = await fetch(`${BACKEND_URL}/upload-pdfs`, {
        method: 'POST',
        body: formData,
        // Não definir Content-Type - o browser faz isso automaticamente com o boundary correto
      });

      setProgress(40);
      setCurrentStep('Processando documentos com IA...');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          detail: `Erro HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.detail || errorData.message || 'Erro ao processar documentos');
      }

      const data = await response.json();
      console.log('📥 Resposta do backend:', data);

      setProgress(60);
      setCurrentStep('Validando dados extraídos...');

      if (!data.success && !data.extraido && !data.licitacao) {
        throw new Error('Nenhum dado foi extraído dos documentos');
      }

      // Extrair dados da resposta
      // Backend retorna: { success: true, licitacao: { id, numero_edital, status } }
      const licitacaoBackend = data.licitacao;

      if (!licitacaoBackend || !licitacaoBackend.id) {
        throw new Error('Backend não retornou os dados da licitação');
      }

      setProgress(80);
      setCurrentStep('Licitação salva! Carregando dados completos...');

      // Buscar dados completos do Supabase usando o ID retornado
      const licitacaoCompleta = await fetchLicitacaoById(licitacaoBackend.id);

      if (!licitacaoCompleta) {
        throw new Error('Erro ao buscar licitação salva');
      }

      setProgress(100);
      setCurrentStep('Concluído!');

      // Feedback de sucesso
      toast.success('Licitação cadastrada com sucesso!', {
        description: `Edital: ${licitacaoCompleta.numero_edital || 'Sem número'}`,
      });

      // Aguardar 500ms para mostrar o progresso completo
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirecionar para a página de detalhes
      navigate(`/licitacao/${licitacaoCompleta.id}`);

    } catch (err) {
      console.error('❌ Erro ao processar:', err);
      
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao processar';
      setError(message);
      
      toast.error('Erro ao processar documentos', {
        description: message,
      });

      setProgress(0);
      setCurrentStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          disabled={isProcessing}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova Licitação</h1>
          <p className="text-muted-foreground">
            Faça upload dos documentos para processamento
          </p>
        </div>
      </div>

      {/* Alert de Instruções */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Faça upload do Edital, Termo de Referência e Anexos em formato PDF. 
          Os documentos serão processados automaticamente para extração de dados.
        </AlertDescription>
      </Alert>

      {/* Card Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Documentos</CardTitle>
          <CardDescription>
            Arraste ou selecione os arquivos PDF da licitação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Componente de Upload */}
          <FileUpload
            files={files}
            onFilesChange={setFiles}
            disabled={isProcessing}
          />

          {/* Barra de Progresso */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{currentStep}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Mensagem durante processamento */}
          {isProcessing && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Processando documentos...
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Nossa IA está extraindo informações dos PDFs. Isso pode levar alguns segundos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && !isProcessing && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de Sucesso */}
          {progress === 100 && !error && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Documentos processados com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          {/* Botões de Ação */}
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
        </CardContent>
      </Card>

      {/* Card de Dicas */}
      {!isProcessing && files.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">💡 Dicas para melhor resultado:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Faça upload de PDFs com boa qualidade</li>
              <li>• Inclua o edital completo e anexos relevantes</li>
              <li>• Arquivos digitais (não escaneados) funcionam melhor</li>
              <li>• Você pode fazer upload de múltiplos arquivos</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}