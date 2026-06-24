from dataclasses import dataclass
from typing import Callable

import polars as pl


@dataclass(frozen=True)
class PlayerSelection:
    query: str
    player_id: str
    player_name: str
    name_column: str
    id_column: str


@dataclass(frozen=True)
class PlotDefinition:
    position: str
    metric: str
    description: str
    renderer: Callable[[pl.DataFrame, PlayerSelection], object]


@dataclass(frozen=True)
class PlotRenderResult:
    position: str
    metric: str
    player: PlayerSelection
    image_bytes: bytes

