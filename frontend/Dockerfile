FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

EXPOSE 4173

# We use --host 0.0.0.0 so the server is accessible outside the container
CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0" ]