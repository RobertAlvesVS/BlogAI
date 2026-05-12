from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import FileResponse
from http import HTTPStatus
from pydantic import BaseModel
from supabase import AsyncClient
from database import get_supabase
from services.criarpost import criar_post

router = APIRouter(prefix="/posts", tags=["Posts"])

class Post(BaseModel):
    id: int
    created_at: datetime
    titulo: str
    conteudo: str
    slug: str
    thumbnail: str

class PostResposta(BaseModel):
    data: list = [Post]
    count: int | None = None
    


@router.get("/", status_code=HTTPStatus.OK, response_model=PostResposta)
async def ler_posts(db: AsyncClient = Depends(get_supabase)):
    return await db.table("posts").select("*").execute()

@router.post("/", status_code=HTTPStatus.CREATED, response_model=PostResposta)
async def criar_post_ia_manualmente():
    return await criar_post()