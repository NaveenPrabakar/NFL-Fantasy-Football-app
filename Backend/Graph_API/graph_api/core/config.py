from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    start_season: int = 2021
    summary_level: str = "reg"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

