from __future__ import annotations

import matplotlib

matplotlib.use("Agg")

from graph_api.domain.models import PlotRenderResult
from graph_api.plots.common import figure_to_png_bytes
from graph_api.registry import PlotRegistry
from graph_api.services.player_resolver import pick_column, resolve_player
from graph_api.services.stats_repository import load_player_stats


class PlotService:
    def __init__(self, registry: PlotRegistry) -> None:
        self._registry = registry

    def render(self, position: str, metric: str, player_query: str) -> PlotRenderResult:
        stats = load_player_stats()
        definition = self._registry.get(position, metric)

        name_column = pick_column(
            stats,
            [
                "player_name",
                "player_display_name",
                "name",
                "full_name",
            ],
        )
        id_column = pick_column(
            stats,
            [
                "player_id",
                "nfl_id",
                "gsis_id",
            ],
        )
        if name_column is None:
            raise ValueError("Could not find a player-name column.")
        if id_column is None:
            raise ValueError("Could not find a player-id column.")

        player = resolve_player(stats, player_query, name_column, id_column)
        figure = definition.renderer(stats, player)
        image_bytes = figure_to_png_bytes(figure)
        return PlotRenderResult(
            position=definition.position,
            metric=definition.metric,
            player=player,
            image_bytes=image_bytes,
        )
