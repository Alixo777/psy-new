const mongoose = require('mongoose');

main().catch(err => {
    console.log("Error in main:", err);
    process.exit(1); // Exit the process with a non-zero status code
});

async function main() {
    console.log(process.env.MONGO_URL);

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongo connect started");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw new Error("Failed to connect to MongoDB");
    }
}

// docker exec -it mongo bash
// mongosh -u admin //pass: admin

//use projects // name of db
// db.createUser(
//     {
//       user: "admin",
//       pwd: "admin",  // Or  "<cleartext password>"
//       roles: [ "readWrite", "dbAdmin" ]
//     }
//  )

