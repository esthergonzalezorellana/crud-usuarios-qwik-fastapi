
echo "Deteniendo todos los contenedores..."
docker stop $(docker ps -aq)

echo "Eliminando todos los contenedores..."
docker rm $(docker ps -aq)

echo "Eliminando todas las imágenes de Docker..."
docker rmi $(docker images -q) -f

echo "Eliminando todos los volúmenes no utilizados..."
docker volume prune -f

echo "Eliminando todas las redes no utilizadas..."
docker network prune -f

echo "Limpieza completada."