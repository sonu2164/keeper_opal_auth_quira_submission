const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.updateOpaData = async () => {
  try {
    const update = await axios.post(
      "http://localhost:7002/data/config",
      {
        id: uuidv4(),
        entries: [
          {
            url: "mysql://root:mysql@example_db:3306/test",
            config: {
              fetcher: "MySQLFetchProvider",
              query: "SELECT * FROM users;",
              connection_params: {
                host: "example_db",
                port: 3306,
                user: "root",
                db: "test",
                password: "mysql",
              },
            },
            topics: ["mysql"],
            dst_path: "users",
            save_method: "PUT",
          },
          {
            url: "mysql://root:mysql@example_db:3306/test",
            config: {
              fetcher: "MySQLFetchProvider",
              query: "SELECT * FROM notes;",
              connection_params: {
                host: "example_db",
                port: 3306,
                user: "root",
                db: "test",
                password: "mysql",
              },
            },
            topics: ["mysql"],
            dst_path: "notes",
            save_method: "PUT",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Update triggered successfully");
    return true;
  } catch (error) {
    console.error("Error updating OPA data:", error.message);
    return false;
  }
};
