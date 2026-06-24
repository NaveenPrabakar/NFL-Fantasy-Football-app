import polars as pl

from graph_api.domain.models import PlotDefinition, PlayerSelection
from graph_api.plots.common import build_line_figure, season_totals
from graph_api.services.player_resolver import pick_column


def _render_passing_yards(df: pl.DataFrame, player: PlayerSelection):
    stat_column = pick_column(df, ["passing_yards", "pass_yards", "passing_yds"])
    if stat_column is None:
        raise ValueError("Could not find a passing-yards column.")

    season_df = season_totals(df, player.id_column, player.player_id, stat_column, aggregation="sum")
    if season_df.height == 0:
        raise ValueError(f"No season totals found for '{player.player_name}'.")

    seasons = season_df.get_column("season").to_list()
    values = season_df.get_column(stat_column).to_list()
    title = f"{player.player_name} Regular Season Passing Yards by Season"
    return build_line_figure(seasons, values, title, "Passing Yards")


def _render_fantasy_points(df: pl.DataFrame, player: PlayerSelection):
    stat_column = pick_column(df, ["fantasy_points", "fantasy_pts", "fantasy_points_ppr", "fantasy_pts_ppr"])
    if stat_column is None:
        raise ValueError("Could not find a fantasy-points column.")

    season_df = season_totals(df, player.id_column, player.player_id, stat_column, aggregation="sum")
    if season_df.height == 0:
        raise ValueError(f"No season totals found for '{player.player_name}'.")

    seasons = season_df.get_column("season").to_list()
    values = season_df.get_column(stat_column).to_list()
    title = f"{player.player_name} Regular Season Fantasy Points by Season"
    return build_line_figure(seasons, values, title, "Fantasy Points")


def build_qb_plots() -> list[PlotDefinition]:
    return [
        PlotDefinition(
            position="qb",
            metric="passing-yards",
            description="Regular season passing yards by season.",
            renderer=_render_passing_yards,
        ),
        PlotDefinition(
            position="qb",
            metric="fantasy-points",
            description="Regular season fantasy points by season.",
            renderer=_render_fantasy_points,
        ),
    ]

