from graph_api.domain.models import PlotDefinition
from graph_api.plots.kicker import build_kicker_plots
from graph_api.plots.pass_catchers import build_wr_te_plots
from graph_api.plots.qb import build_qb_plots
from graph_api.plots.rb import build_rb_plots


def normalize_key(value: str) -> str:
    return value.strip().lower().replace("_", "-")


class PlotRegistry:
    def __init__(self, definitions: list[PlotDefinition]) -> None:
        self._definitions = {
            (normalize_key(definition.position), normalize_key(definition.metric)): definition
            for definition in definitions
        }

    def get(self, position: str, metric: str) -> PlotDefinition:
        key = (normalize_key(position), normalize_key(metric))
        if key not in self._definitions:
            raise KeyError(f"Unknown plot '{position}/{metric}'.")
        return self._definitions[key]


def build_registry() -> PlotRegistry:
    definitions = [
        *build_qb_plots(),
        *build_rb_plots(),
        *build_wr_te_plots(),
        *build_kicker_plots(),
    ]
    return PlotRegistry(definitions)
