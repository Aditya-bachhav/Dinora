import time
from sqlalchemy import text
from app.core.database import engine
with engine.connect() as c:
    for _ in range(5):
        t = time.perf_counter(); c.execute(text("select 1")); print(round((time.perf_counter()-t)*1000), "ms")