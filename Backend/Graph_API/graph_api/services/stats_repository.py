from functools import lru_cache

import nflreadpy as nfl
import polars as pl

from graph_api.core.config import get_settings


@lru_cache(maxsize=1)
def load_player_stats() -> pl.DataFrame:
    settings = get_settings()
    seasons = list(range(settings.start_season, nfl.get_current_season() + 1))
    return nfl.load_player_stats(
        seasons=seasons,
        summary_level=settings.summary_level,
    )

