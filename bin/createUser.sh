docker exec -it mongo mongosh -u admin -p admin  --eval '
    use project;
    db.createUser(
        {
        user: "root",
        pwd: "root", 
        roles: [ "readWrite", "dbAdmin" ]
        }
    )'