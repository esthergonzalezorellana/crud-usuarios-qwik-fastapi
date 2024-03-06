# Usar una imagen de Node como base
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copia todos los archivos que modifiquemos
COPY . .

# Iniciar la aplicación
CMD ["npm", "run", "dev"]

