#!/bin/bash

# Configurações
REGISTRY_USER="seu-usuario"  # Substitua pelo seu usuário do Docker Hub ou outro registro
IMAGE_NAME="avmd-contabil-app"
VERSION=$(date +"%Y%m%d%H%M")  # Versão baseada na data e hora atual

# Verificar se o Docker está instalado e em execução
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker e tente novamente."
    exit 1
fi

echo "========================================"
echo "Construindo imagem Docker: $IMAGE_NAME:$VERSION"
echo "========================================"

# Construir a imagem Docker
docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .

if [ $? -ne 0 ]; then
    echo "Falha ao construir a imagem Docker."
    exit 1
fi

echo "Imagem construída com sucesso."
echo ""

# Perguntar se deseja fazer push para o registro
read -p "Deseja enviar a imagem para o Docker Hub? (s/n): " UPLOAD

if [ "$UPLOAD" == "s" ] || [ "$UPLOAD" == "S" ]; then
    echo "Fazendo login no Docker Hub..."
    docker login

    if [ $? -ne 0 ]; then
        echo "Falha ao fazer login no Docker Hub."
        exit 1
    fi

    # Tag com usuário para o Docker Hub
    docker tag $IMAGE_NAME:$VERSION $REGISTRY_USER/$IMAGE_NAME:$VERSION
    docker tag $IMAGE_NAME:latest $REGISTRY_USER/$IMAGE_NAME:latest

    # Push para o Docker Hub
    echo "Enviando imagem para o Docker Hub..."
    docker push $REGISTRY_USER/$IMAGE_NAME:$VERSION
    docker push $REGISTRY_USER/$IMAGE_NAME:latest

    if [ $? -ne 0 ]; then
        echo "Falha ao enviar imagem para o Docker Hub."
        exit 1
    fi

    echo "Imagem enviada com sucesso para o Docker Hub."
    echo "Repositório: $REGISTRY_USER/$IMAGE_NAME"
    echo "Tags: $VERSION, latest"
else
    echo "Operação de upload cancelada."
fi

echo "========================================"
echo "Para executar localmente, use:"
echo "docker run -p 8080:80 $IMAGE_NAME:latest"
echo "========================================"