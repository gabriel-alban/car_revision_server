### DOCKER COMMANDS start/end app
- ```docker-compose up -d```
- ```docker-compose down``` 

### SEE LOGS
- ```docker logs -f node_api``` -> node_api is the container name

### ENTER MONGO CONTAINER
- ```docker exec -it mongo_db mongosh```

### DOCKER COMMANDS for seeing logs
- ```docker exec node_api cat /app/error.log```
- ```docker exec node_api cat /app/exceptions.log```
- ```docker exec node_api cat /app/rejections.log```

### SEE LOG FILE IN REAL TIME
- ```docker exec node_api tail -f /app/error.log```
