FROM nginx:alpine

# Configurar fuso horário para Brasil
RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

# Copiar os arquivos da aplicação
COPY . /usr/share/nginx/html/

# Configurar NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de inicialização e torná-lo executável
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Expor a porta 80
EXPOSE 80

# Define o script de inicialização como ponto de entrada
ENTRYPOINT ["/docker-entrypoint.sh"]

# Comando para iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]