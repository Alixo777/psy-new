docker stop node-app 
docker rm node-app
docker build -t node-app .
docker run --name node-app -d --rm -p 3003:3003 node-app
docker build -t front-app -f  .\build\Dockerfilebeckend .
docker run -it --rm -d -p 80:80 --name web front-app