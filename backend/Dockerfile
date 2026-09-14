FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN pnpm prisma:generate \
	&& mkdir -p node_modules/.prisma \
	&& cp -R node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/* node_modules/.prisma/ \
	&& pnpm build
FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY --from=build /app/package.json /app/pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
