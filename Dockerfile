FROM oven/bun:latest AS build

WORKDIR /app/frontend

COPY Frontend/package.json .
RUN bun install
COPY ./Frontend .
RUN bun run build

FROM oven/bun:latest
WORKDIR /app

COPY ./Backend/package.json .
RUN bun install
COPY ./Backend .
COPY --from=build /app/frontend/dist .


CMD ["sh", "-c", "bunx prisma migrate deploy && bunx prisma generate && bun run production"]