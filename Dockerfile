FROM postgis/postgis:17-3.5

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      postgresql-contrib \
      git \
      build-essential \
      postgresql-server-dev-17 \
      llvm-13 \
      llvm-13-dev \
      clang-13 && \
    rm -rf /var/lib/apt/lists/*

RUN cd /tmp && \
    git clone --branch v0.8.1 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/pgvector
