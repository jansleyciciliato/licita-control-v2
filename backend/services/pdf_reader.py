import fitz  # PyMuPDF

def pdf_to_text(file_path: str) -> str:
    text = []

    with fitz.open(file_path) as doc:
        for page in doc:
            text.append(page.get_text())

    return "\n".join(text)
