import { Licitacao, LicitacaoStatus, STATUS_CONFIG } from '@/types/licitacao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Trash2 } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Status da Licitação</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Dados Gerais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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

      {/* Objeto */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Objeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
      {licitacao.itens && licitacao.itens.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Itens da Licitação</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
