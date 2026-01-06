from datetime import datetime
from services.supabase_client import supabase


def salvar_licitacao(dados: dict) -> dict:
    payload = {
        "numero_edital": dados.get("numero_edital"),
        "numero_processo": dados.get("numero_processo"),
        "orgao": dados.get("orgao"),
        "modalidade": dados.get("modalidade"),
        "tipo_disputa": dados.get("tipo_disputa"),
        "registro_preco": dados.get("registro_preco"),
        "tipo_lances": dados.get("tipo_lances"),
        "data_abertura": dados.get("data_abertura"),
        "data_hora_abertura": dados.get("data_hora_abertura"),
        "objeto": dados.get("objeto"),
        "objeto_resumido": dados.get("objeto_resumido"),
        "documentos_habilitacao": dados.get("documentos_habilitacao"),
        "itens": dados.get("itens", []),
        "status": "ANALISAR",
        "data_cadastro": datetime.utcnow().isoformat()
    }

    response = supabase.table("licitacoes").insert(payload).execute()

    if response.data is None:
        raise Exception("Erro ao inserir licitação no Supabase")

    return response.data[0]
