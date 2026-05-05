# Use a imagem oficial do Node.js como base
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do projeto
COPY . .

# Faz o build da aplicação
RUN npm run build

# Etapa de produção usando um servidor Nginx leve
FROM nginx:alpine

# Copia os arquivos de build para o servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
