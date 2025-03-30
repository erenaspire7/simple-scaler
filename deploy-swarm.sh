# build base
docker build -t simple-scaler-base:latest -f base.Dockerfile .

# build transcription service
docker build -t simple-scaler-transcription:latest -f apps/services/transcription/Dockerfile .

# build api
docker build -t simple-scaler-api:latest -f apps/api/Dockerfile .

# build stream
docker build -t simple-scaler-stream:latest -f apps/services/stream/Dockerfile .

export STAGE=$1

if [ -z "$STAGE" ]; then
    echo "Usage: $0 <local|deploy>"
    exit 1
fi

if [ "$STAGE" = "local" ]; then
    # Try to get the swarm status
    SWARM_STATUS=$(docker info | grep -w "Swarm:" | sed 's/Swarm: //' | tr -d '[:space:]')
    echo "Current swarm status: $SWARM_STATUS"

    # Try to initialize swarm if not active (this will fail with a helpful message if already in a swarm)
    if [ "$SWARM_STATUS" != "active" ]; then
        echo "Attempting to initialize swarm..."
        docker swarm init || echo "Already in a swarm or initialization failed"
    fi

    # Create network if it doesn't exist (using --attachable for local development convenience)
    echo "Ensuring traefik-net exists in swarm scope..."
    docker network create --driver overlay --scope swarm --attachable traefik-net 2>/dev/null || echo "Network traefik-net already exists"
    
    # Deploy the stack
    echo "Deploying stack..."
    docker stack deploy -c docker-compose.prod.yml --resolve-image always simple-scaler
    exit 0
fi