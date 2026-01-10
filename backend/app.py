from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List
import os
import shutil

load_dotenv(dotenv_path=".env")

from services.pdf_reader import pdf_to_text
from services.ai_extractor import extract_licitacao_data
from services.licitacao_repository import salvar_licitacao

app = FastAPI(
    title="Licita Control API",
    description="API para processamento de licitações com IA",
    version="1.0.0"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # React dev
        "http://127.0.0.1:5173",  # Servidor backend
        "https://n8n-licita-control-v2.qwzkj4.easypanel.host",  # Produção
        "*"  # Permitir todos (remova em produção se quiser mais segurança)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def health():
    """Endpoint de health check"""
    return {
        "status": "ok",
        "service": "Licita Control API",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Health check detalhado"""
    return {
        "status": "healthy",
        "supabase": "connected" if os.getenv("SUPABASE_URL") else "not configured",
        "openai": "configured" if os.getenv("OPENAI_API_KEY") else "not configured"
    }

@app.post("/upload-pdfs")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    """
    Processa PDFs de licitação:
    1. Extrai texto dos PDFs
    2. Usa IA para extrair dados estruturados
    3. Salva no Supabase
    """
    try:
        textos = []

        # Ler e processar cada arquivo
        for file in files:
            # Validar tipo de arquivo
            if not file.filename.endswith('.pdf'):
                return {
                    "success": False,
                    "error": f"Arquivo {file.filename} não é um PDF"
                }

            file_path = os.path.join(UPLOAD_DIR, file.filename)

            # Salvar arquivo temporariamente
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Extrair texto do PDF
            try:
                texto = pdf_to_text(file_path)
                textos.append(texto)
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Erro ao ler PDF {file.filename}: {str(e)}"
                }
            finally:
                # Limpar arquivo após processar
                if os.path.exists(file_path):
                    os.remove(file_path)

        # Consolidar textos
        texto_consolidado = "\n\n".join(textos)

        if not texto_consolidado.strip():
            return {
                "success": False,
                "error": "Não foi possível extrair texto dos PDFs"
            }

        # Extrair dados com IA
        try:
            resultado_ia = extract_licitacao_data(texto_consolidado)
        except Exception as e:
            return {
                "success": False,
                "error": f"Erro ao processar com IA: {str(e)}"
            }

        # Verificar erros da IA
        if "__ERROR__" in resultado_ia:
            if resultado_ia["__ERROR__"] == "QUOTA":
                return {
                    "success": False,
                    "error": "IA sem créditos. Verifique o plano da OpenAI."
                }

            return {
                "success": False,
                "error": "Erro ao processar a IA.",
                "details": resultado_ia["__ERROR__"]
            }

        # Salvar no Supabase
        try:
            licitacao_salva = salvar_licitacao(resultado_ia)
        except Exception as e:
            return {
                "success": False,
                "error": f"Erro ao salvar no banco: {str(e)}"
            }

        # Retornar sucesso
        return {
            "success": True,
            "licitacao": {
                "id": licitacao_salva["id"],
                "numero_edital": licitacao_salva.get("numero_edital"),
                "status": licitacao_salva.get("status", "ANALISAR")
            }
        }

    except Exception as e:
        # Erro genérico
        return {
            "success": False,
            "error": f"Erro inesperado: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
