from supabase import acreate_client, AsyncClient
from config.config import settings

async def get_supabase() -> AsyncClient:
    return await acreate_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)