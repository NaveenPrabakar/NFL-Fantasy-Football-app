import re

import polars as pl

from graph_api.domain.models import PlayerSelection


def pick_column(df: pl.DataFrame, candidates: list[str]) -> str | None:
    for candidate in candidates:
        if candidate in df.columns:
            return candidate
    return None


def _normalize_text(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9 ]", "", value.lower())
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized


def _normalize_expr(column: pl.Expr) -> pl.Expr:
    return (
        column.fill_null("")
        .str.to_lowercase()
        .str.replace_all(r"[^a-z0-9 ]", "")
        .str.replace_all(r"\s+", " ")
        .str.strip_chars()
    )


def resolve_player(df: pl.DataFrame, player_query: str, name_column: str, id_column: str) -> PlayerSelection:
    query = player_query.strip()
    normalized_query = _normalize_text(query)

    exact_name = (
        df.filter(_normalize_expr(pl.col(name_column)) == normalized_query)
        .select([name_column, id_column])
        .unique()
    )
    if exact_name.height == 1:
        row = exact_name.row(0)
        return PlayerSelection(
            query=query,
            player_id=row[1],
            player_name=row[0],
            name_column=name_column,
            id_column=id_column,
        )
    if exact_name.height > 1:
        raise ValueError(f"Multiple players matched '{player_query}':\n{exact_name}")

    exact_id = (
        df.filter(pl.col(id_column).fill_null("").cast(pl.Utf8).str.to_lowercase() == query.lower())
        .select([name_column, id_column])
        .unique()
    )
    if exact_id.height == 1:
        row = exact_id.row(0)
        return PlayerSelection(
            query=query,
            player_id=row[1],
            player_name=row[0],
            name_column=name_column,
            id_column=id_column,
        )
    if exact_id.height > 1:
        raise ValueError(f"Multiple player IDs matched '{player_query}':\n{exact_id}")

    partial = df
    for token in normalized_query.split():
        partial = partial.filter(_normalize_expr(pl.col(name_column)).str.contains(token, literal=False))

    partial = partial.select([name_column, id_column]).unique()
    if partial.height == 1:
        row = partial.row(0)
        return PlayerSelection(
            query=query,
            player_id=row[1],
            player_name=row[0],
            name_column=name_column,
            id_column=id_column,
        )
    if partial.height > 1:
        raise ValueError(f"Multiple players matched '{player_query}':\n{partial}")

    raise ValueError(f"No player found for '{player_query}'.")

