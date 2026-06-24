from fastapi import FastAPI

from graph_api.api.routes import router


app = FastAPI(title="NFL Graph API", version="1.0.0")
app.include_router(router, prefix="/api/graph")

