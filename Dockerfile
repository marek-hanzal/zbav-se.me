FROM postgis/postgis:16-3.4

# Install contrib + build deps pro pgvector
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        postgresql-contrib \
        git \
        build-essential \
        postgresql-server-dev-16 \
        llvm-13 \
        llvm-13-dev \
        clang-13 && \
    rm -rf /var/lib/apt/lists/*

# Build + install pgvector
RUN cd /tmp && \
    git clone --branch v0.8.1 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/pgvector
