from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    KEYOPENROUTER: str = "Faltou a keyOpenRouter"
    SUPABASE_URL: str = "Faltou a SupabaseURL"
    SUPABASE_KEY: str = "Faltou a SupabaseKey"
    URLOPENROUTER: str = "Falto a URL da IA"
    MODEL_IA: str = "faltou o Modelo de IA"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()