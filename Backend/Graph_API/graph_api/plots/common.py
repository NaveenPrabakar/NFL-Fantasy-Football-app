from io import BytesIO

import matplotlib.pyplot as plt
import polars as pl


def figure_to_png_bytes(fig) -> bytes:
    buffer = BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)
    return buffer.getvalue()


def season_totals(df: pl.DataFrame, id_column: str, player_id: str, stat_column: str, aggregation: str = "sum") -> pl.DataFrame:
    if aggregation == "sum":
        stat_expr = pl.col(stat_column).sum().alias(stat_column)
    elif aggregation == "mean":
        stat_expr = pl.col(stat_column).mean().alias(stat_column)
    else:
        raise ValueError(f"Unsupported aggregation '{aggregation}'.")

    return (
        df.filter(pl.col(id_column) == player_id)
        .group_by("season")
        .agg(stat_expr)
        .sort("season")
    )


def build_line_figure(seasons: list[int], values: list[float], title: str, ylabel: str):
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.plot(seasons, values, marker="o")
    ax.set_xticks(seasons)
    ax.set_xticklabels([str(int(season)) for season in seasons])
    ax.set_title(title)
    ax.set_xlabel("Season")
    ax.set_ylabel(ylabel)
    ax.grid(True)
    fig.tight_layout()
    return fig


def latest_season_value(df: pl.DataFrame, season_column: str = "season") -> int:
    return int(df.select(pl.col(season_column).max()).item())


def grouped_bar_figure(labels: list[str], left_values: list[float], right_values: list[float], left_label: str, right_label: str, title: str, xlabel: str, ylabel: str):
    import numpy as np

    x = np.arange(len(labels))
    width = 0.38

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.bar(x - width / 2, left_values, width, label=left_label)
    ax.bar(x + width / 2, right_values, width, label=right_label)
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.legend()
    ax.grid(axis="y")
    fig.tight_layout()
    return fig

