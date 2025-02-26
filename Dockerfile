FROM oven/bun:latest

WORKDIR /app
COPY package.json .
RUN bun install

COPY . .

CMD ["sh", "-c", "bunx prisma migrate deploy && bunx prisma generate && bun run production"]