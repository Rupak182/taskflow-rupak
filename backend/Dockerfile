FROM ghcr.io/astral-sh/uv:debian-slim

WORKDIR /app

COPY pyproject.toml uv.lock /app/

RUN uv sync --locked

COPY . /app/

ENV ENVIRONMENT=production

EXPOSE 8000

CMD ["uv", "run", "main.py"]