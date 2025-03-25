docker exec -it mongo mongosh -u admin -p admin  --eval '
    use project;
    db.createUser(
        {
        user: "admin",
        pwd: "admin", 
        roles: [ "readWrite", "dbAdmin" ]
        }
    )'