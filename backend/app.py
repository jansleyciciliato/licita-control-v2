from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
from typing import List
import os
import shutil

load_dotenv(dotenv_path=".env")

from services.pdf_reader import pdf_to_text
from services.ai_extractor import extract_licitacao_data
from services.licitacao_repository import salvar_licitacao

app = FastAPI(title="Licita Control API")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/upload-pdfs")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    textos = []

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        textos.append(pdf_to_text(file_path))

    texto_consolidado = "\n\n".join(textos)

    resultado_ia = extract_licitacao_data(texto_consolidado)

    licitacao_salva = salvar_licitacao(resultado_ia)

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

    return {
        "success": True,
        "licitacao": {
            "id": licitacao_salva["id"],
            "numero_edital": licitacao_salva["numero_edital"],
            "status": licitacao_salva["status"]
        }
    }
