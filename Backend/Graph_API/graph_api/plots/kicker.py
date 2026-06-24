import polars as pl

from graph_api.domain.models import PlotDefinition, PlayerSelection
from graph_api.plots.common import build_line_figure, grouped_bar_figure, latest_season_value
from graph_api.services.player_resolver import pick_column


REQUIRED_DISTANCE_COLUMNS = [
    "fg_made_0_19",
    "fg_made_20_29",
    "fg_made_30_39",
    "fg_made_40_49",
    "fg_made_50_59",
    "fg_made_60_",
    "fg_missed_0_19",
    "fg_missed_20_29",
    "fg_missed_30_39",
    "fg_missed_40_49",
    "fg_missed_50_59",
    "fg_missed_60_",
]


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


def _render_distance_attempts(df: pl.DataFrame, player: PlayerSelection):
    missing_columns = [column for column in REQUIRED_DISTANCE_COLUMNS if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing expected distance columns: {missing_columns}")

    player_rows = df.filter(pl.col(player.id_column) == player.player_id)
    if player_rows.height == 0:
        raise ValueError(f"No kick attempts found for '{player.player_name}'.")

    latest_season = latest_season_value(player_rows)
    season_rows = player_rows.filter(pl.col("season") == latest_season)

    labels = ["0-19", "20-29", "30-39", "40-49", "50-59", "60+"]
    made_columns = [
        "fg_made_0_19",
        "fg_made_20_29",
        "fg_made_30_39",
        "fg_made_40_49",
        "fg_made_50_59",
        "fg_made_60_",
    ]
    missed_columns = [
        "fg_missed_0_19",
        "fg_missed_20_29",
        "fg_missed_30_39",
        "fg_missed_40_49",
        "fg_missed_50_59",
        "fg_missed_60_",
    ]

    made_totals = season_rows.select([pl.col(column).sum().alias(column) for column in made_columns]).row(0)
    missed_totals = season_rows.select([pl.col(column).sum().alias(column) for column in missed_columns]).row(0)

    title = f"{player.player_name} Field Goal Makes vs Misses by Distance ({latest_season} Season)"
    return grouped_bar_figure(labels, list(made_totals), list(missed_totals), "Made", "Missed", title, "Kick Distance", "Attempts")


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
            metric="distance-attempts",
            description="Made vs missed field goals by distance in the latest season.",
            renderer=_render_distance_attempts,
        ),
    ]

