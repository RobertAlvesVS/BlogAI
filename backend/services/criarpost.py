import json
import httpx
from config.config import settings
from database import get_supabase


async def criar_post():
    async with httpx.AsyncClient(timeout=120.0) as client:
        url = settings.URLOPENROUTER
        headers = {
            "Authorization": f"Bearer {settings.KEYOPENROUTER}",
            "Content-Type": "application/json",
        }
        jsonr = {
            "model": settings.MODEL_IA,
            "messages": [
                {
                    "role": "system",
                    "content": 'Você é uma IA responsável por criar posts completos para um blog.\n\nSua função é retornar APENAS um JSON válido, sem explicações, sem markdown externo e sem texto adicional.\n\nO conteúdo deve ser escrito em português do Brasil, com linguagem natural, organizada e otimizada para SEO.\n\nRegras:\n- O campo \'titulo\' deve ser atrativo.\n- O campo \'conteudo\' deve ser escrito em Markdown.\n- Use Markdown bem formatado.\n- O artigo deve ser completo, bem estruturado e fácil de ler.\n- O campo \'slug\' deve ser amigável para URL.\n- O campo \'thumbnail\' deve conter uma URL de imagem relacionada ao tema e não pegue do https://images.unsplash.com\n- O campo \'created_at\' deve retornar no formato ISO 8601.\n- O campo \'id\' deve ser um número bigint fictício.\n- O campo \'number\' deve ser um número inteiro sequencial fictício.\n- Nunca retorne null.\n- Nunca retorne comentários.\n- Nunca envolva o JSON com ```.\n- Sempre retorne um JSON válido.\n\nEstrutura obrigatória:\n\n{\n  "id": 123456789,\n  "number": 1,\n  "created_at": "2026-05-11T10:00:00Z",\n  "titulo": "Título do artigo",\n  "conteudo": "# Título\\n\\nConteúdo em markdown...",\n  "slug": "titulo-do-artigo",\n  "thumbnail": "https://site.com/imagem.jpg"\n}',
                },
                {
                    "role": "user",
                    "content": "Crie um artigo sobre um tema aleatorio de sua preferencia",
                },
            ],
            "reasoning": {"enabled": True},
        }
        response = await client.post(url, headers=headers, json=jsonr)
        data = response.json()
        conteudo = data["choices"][0]["message"]["content"]
        post = json.loads(conteudo)
        db = await get_supabase()
        resposta = (
            await db.table("posts")
            .insert(
                [
                    {
                        "titulo": post["titulo"],
                        "conteudo": post["conteudo"],
                        "slug": post["slug"],
                        "thumbnail": post["thumbnail"],
                    },
                ]
            )
            .execute()
        )
        return resposta
