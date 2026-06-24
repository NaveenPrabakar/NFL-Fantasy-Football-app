import polars as pl

from graph_api.domain.models import PlotDefinition, PlayerSelection
from graph_api.plots.common import build_line_figure, cumulative_season_totals
from graph_api.services.player_resolver import pick_column


def _render_fg_percentage(df: pl.DataFrame, player: PlayerSelection):
    stat_column = pick_column(df, ["fg_pct", "field_goal_pct", "field_goals_pct"])
    if stat_column is None:
        raise ValueError("Could not find an fg_pct column.")

    season_df = (
        df.filter(pl.col(player.id_column) == player.player_id)
        .group_by("season")
        .agg(pl.col(stat_column).mean().alias(stat_column))
        .sort("season")
    )
    if season_df.height == 0:
        raise ValueError(f"No season totals found for '{player.player_name}'.")

    seasons = season_df.get_column("season").to_list()
    values = season_df.get_column(stat_column).to_list()
    title = f"{player.player_name} Regular Season Field Goal Percentage by Season"
    return build_line_figure(seasons, values, title, "FG %")


def _render_career_fg_attempts(df: pl.DataFrame, player: PlayerSelection):
    attempt_column = pick_column(df, ["kicking_fg_attempts"])
    if attempt_column is None:
        raise ValueError("Could not find a field-goal attempts column.")

    season_df = cumulative_season_totals(df, player.id_column, player.player_id, attempt_column)
    if season_df.height == 0:
        raise ValueError(f"No season totals found for '{player.player_name}'.")

    seasons = season_df.get_column("season").to_list()
    values = season_df.get_column(attempt_column).to_list()
    title = f"{player.player_name} Career Field Goal Attempts by Season"
    return build_line_figure(seasons, values, title, "Career Field Goal Attempts")


def build_kicker_plots() -> list[PlotDefinition]:
    return [
        PlotDefinition(
            position="kicker",
            metric="field-goal-percentage",
            description="Regular season field goal percentage by season.",
            renderer=_render_fg_percentage,
        ),
        PlotDefinition(
            position="kicker",
            metric="career-fg-attempts",
            description="Career field goal attempts by season.",
            renderer=_render_career_fg_attempts,
        ),
    ]
