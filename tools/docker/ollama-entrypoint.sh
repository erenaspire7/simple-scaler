#!/bin/bash
    
ollama serve &

# Wait for Ollama service to start up
echo "Waiting for Ollama service to start..."
sleep 5

# Define models to pull - add or remove models from this array as needed
declare -a models_to_pull=(
    "dimavz/whisper-tiny"
)

# Pull each specified model
for model in "${models_to_pull[@]}"; do
    echo "Pulling model: $model"
    ollama pull "$model"
done

wait