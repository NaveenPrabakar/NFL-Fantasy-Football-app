from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

from graph_api.registry import build_registry
from graph_api.services.plot_service import PlotService


router = APIRouter()
plot_service = PlotService(build_registry())

@router.get("/{position}/{metric}/image")
def get_graph_image(position: str, metric: str, player: str = Query(..., min_length=1)):
    try:
        result = plot_service.render(position, metric, player)
        return Response(content=result.image_bytes, media_type="image/png")
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
