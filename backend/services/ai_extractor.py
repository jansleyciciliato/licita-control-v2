import os
from openai import OpenAI, RateLimitError, OpenAIError
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_licitacao_data(text: str) -> dict:
    try:
        with open("prompts/licitacao_prompt.txt", "r", encoding="utf-8") as f:
            prompt_template = f.read()

        prompt = prompt_template.replace("{{TEXTO}}", text[:120000])

        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            messages=[
                {"role": "system", "content": "Você é um especialista em licitações públicas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        resposta = response.choices[0].message.content.strip()

        return json.loads(resposta)

    except json.JSONDecodeError:
        return {"__ERROR__": "JSON_INVALIDO"}

    except RateLimitError:
        return {"__ERROR__": "QUOTA"}

    except OpenAIError as e:
        return {"__ERROR__": str(e)}