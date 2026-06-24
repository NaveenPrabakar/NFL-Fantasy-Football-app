from functools import lru_cache
from pathlib import Path
import json

import polars as pl


DATA_PATH = Path(__file__).resolve().parents[3] / "Data" / "seasonal_stats.json"


def _flatten_record(record: dict, prefix: str = "") -> dict:
    flat: dict[str, object] = {}
    for key, value in record.items():
        column_name = f"{prefix}{key}" if prefix else key
        if isinstance(value, dict):
            flat.update(_flatten_record(value, f"{column_name}_"))
        else:
            flat[column_name] = value
    return flat


def _with_aliases(row: dict) -> dict:
    player_display_name = row.get("player_display_name") or row.get("player_name")
    player_name = row.get("player_name") or player_display_name

    aliases = {
        "player_name": player_name,
        "player_display_name": player_display_name,
        "name": player_name,
        "full_name": player_display_name,
        "passing_yards": row.get("passing_yards"),
        "pass_yards": row.get("passing_yards"),
        "passing_yds": row.get("passing_yards"),
        "rushing_yards": row.get("rushing_yards"),
        "rush_yards": row.get("rushing_yards"),
        "rushing_yds": row.get("rushing_yards"),
        "receiving_yards": row.get("receiving_yards"),
        "rec_yards": row.get("receiving_yards"),
        "receiving_yds": row.get("receiving_yards"),
        "fantasy_points": row.get("fantasy_ppr") or row.get("fantasy_standard"),
        "fantasy_pts": row.get("fantasy_ppr") or row.get("fantasy_standard"),
        "fantasy_points_ppr": row.get("fantasy_ppr"),
        "fantasy_pts_ppr": row.get("fantasy_ppr"),
        "fg_pct": row.get("kicking_fg_pct"),
        "field_goal_pct": row.get("kicking_fg_pct"),
        "field_goals_pct": row.get("kicking_fg_pct"),
        "fg_made_0_19": row.get("kicking_fg_buckets_0_19"),
        "fg_made_20_29": row.get("kicking_fg_buckets_20_29"),
        "fg_made_30_39": row.get("kicking_fg_buckets_30_39"),
        "fg_made_40_49": row.get("kicking_fg_buckets_40_49"),
        "fg_made_50_59": row.get("kicking_fg_buckets_50_59"),
        "fg_made_60_": row.get("kicking_fg_buckets_60_plus"),
        "fg_missed_0_19": 0,
        "fg_missed_20_29": 0,
        "fg_missed_30_39": 0,
        "fg_missed_40_49": 0,
        "fg_missed_50_59": 0,
        "fg_missed_60_": 0,
    }
    row.update(aliases)
    return row


@lru_cache(maxsize=1)
def load_player_stats() -> pl.DataFrame:
    raw_rows = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    flattened = [_with_aliases(_flatten_record(row)) for row in raw_rows]
    return pl.from_dicts(flattened)
