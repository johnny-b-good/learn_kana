# Base images
FROM python:3.8-slim AS main

# Python variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /srv/learn_kana

# Install Python requirements
RUN pip install --no-cache --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache -r requirements.txt

# START OF NODE STAGE
# ==============================================================================
FROM node:14-slim AS node

# Set working directory
WORKDIR /srv/learn_kana

# Install Node.js requirements
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Copy app source
COPY src ./src

# Copy frontend configs
COPY postcss.config.js .
COPY tailwind.config.js .

# Build frontend
RUN npm run build:styles

# END OF NODE STAGE
# ==============================================================================

# MAIN STAGE CONTINUED
# ==============================================================================
FROM main AS main_continued

# Copy app source code
COPY src ./src

# Copy SQLite3 database
COPY entries.db .

# Copy built frontend assets and some deps
COPY --from=node /srv/learn_kana/src/static/style.css ./src/static/

# Run command
ENTRYPOINT ["gunicorn", "--chdir", "./src", "--bind", "0.0.0.0:8000", "-w", "4", "wsgi:app"]
