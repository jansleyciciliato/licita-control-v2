import { Licitacao, LicitacaoStatus, STATUS_CONFIG } from '@/types/licitacao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Trash2, FileCheck, Package, FileText } from 'lucide-react';

interface LicitacaoFormProps {
  licitacao: Licitacao;
  onChange: (updates: Partial<Licitacao>) => void;
  onSave: () => void;
  onDelete: () => void;
  onStatusChange: (status: LicitacaoStatus) => void;
}

export function LicitacaoForm({ 
  licitacao, 
  onChange, 
  onSave, 
  onDelete,
  onStatusChange 
}: LicitacaoFormProps) {
  const documentosHabilitacao = licitacao.documentos_habilitacao as Record<string, string[]> | null;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Status da Licitação</Label>
              <Select value={licitacao.status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Dados Gerais</span>
            <span className="sm:hidden">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Documentos</span>
            <span className="sm:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="itens" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Objetos e Itens</span>
            <span className="sm:hidden">Itens</span>
          </TabsTrigger>
        </TabsList>

        {/* Dados Gerais Tab */}
        <TabsContent value="dados" className="mt-6">
          <Card>
            <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="numero_edital">Número do Edital</Label>
                <Input
                  id="numero_edital"
                  value={licitacao.numero_edital}
                  onChange={(e) => onChange({ numero_edital: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_processo">Número do Processo</Label>
                <Input
                  id="numero_processo"
                  value={licitacao.numero_processo}
                  onChange={(e) => onChange({ numero_processo: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="orgao">Órgão</Label>
                <Input
                  id="orgao"
                  value={licitacao.orgao}
                  onChange={(e) => onChange({ orgao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Input
                  id="modalidade"
                  value={licitacao.modalidade}
                  onChange={(e) => onChange({ modalidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_disputa">Tipo de Disputa</Label>
                <Input
                  id="tipo_disputa"
                  value={licitacao.tipo_disputa}
                  onChange={(e) => onChange({ tipo_disputa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_lances">Tipo de Lances</Label>
                <Input
                  id="tipo_lances"
                  value={licitacao.tipo_lances}
                  onChange={(e) => onChange({ tipo_lances: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="registro_preco"
                  checked={licitacao.registro_preco}
                  onCheckedChange={(checked) => onChange({ registro_preco: checked })}
                />
                <Label htmlFor="registro_preco">Registro de Preços</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_abertura">Data de Abertura</Label>
                <Input
                  id="data_abertura"
                  type="date"
                  value={licitacao.data_abertura}
                  onChange={(e) => onChange({ data_abertura: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora_abertura">Hora de Abertura</Label>
                <Input
                  id="hora_abertura"
                  type="time"
                  value={licitacao.data_hora_abertura.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => onChange({ 
                    data_hora_abertura: `${licitacao.data_abertura}T${e.target.value}:00` 
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos Tab */}
        <TabsContent value="documentos" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Documentos para Habilitação</h3>
              {documentosHabilitacao && Object.keys(documentosHabilitacao).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(documentosHabilitacao).map(([categoria, docs]) => (
                    <div key={categoria} className="border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2 capitalize">
                        {categoria.replace(/_/g, ' ')}
                      </h4>
                      <ul className="space-y-1">
                        {Array.isArray(docs) && docs.map((doc, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum documento de habilitação cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objetos e Itens Tab */}
        <TabsContent value="itens" className="mt-6 space-y-6">
          {/* Objeto */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Objeto da Licitação</h3>
              <div className="space-y-2">
                <Label htmlFor="objeto_resumido">Objeto Resumido</Label>
                <Input
                  id="objeto_resumido"
                  value={licitacao.objeto_resumido}
                  onChange={(e) => onChange({ objeto_resumido: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objeto">Objeto Completo</Label>
                <Textarea
                  id="objeto"
                  rows={4}
                  value={licitacao.objeto}
                  onChange={(e) => onChange({ objeto: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Itens da Licitação</h3>
              {licitacao.itens && licitacao.itens.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lote</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Valor Est.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licitacao.itens.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.descricao}</TableCell>
                          <TableCell>{item.unidade}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell className="text-right">
                            {item.valor_estimado.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum item cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
