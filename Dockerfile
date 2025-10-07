# Imagen base de Nginx
FROM nginx:alpine

# Eliminamos la configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos del proyecto a la carpeta de Nginx
COPY . /usr/share/nginx/html

# Copiamos una configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
