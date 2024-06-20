# 📝 Keeper

Welcome to the **Keeper** project! 

A note/thought sharing webapp.
Roles: member, admin
1: member can view all notes (his and create by others), he can update and delete his notes/thoughts.
2: Admin can do anything create, view, update or deletion of notes.


https://github.com/sonu2164/keeper_opal_auth_quira_submission/assets/102368177/907af141-07f9-417d-9053-fecbd08cbd1c



## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [TechStack](#techstack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)


## Introduction
Resipe is a recipe sharing webapp where user's karma and location affect their permissions to perform operations such as view recipe or upvote recipe, it fetches the data dynamically from a mysql server and uses auth0 for authentication, opal for authorisation implementing custom opal data fetcher for mysql.

Two main goals of this project were:
- to showcase authorization using opal.
- to use custom data fetcher with mysql for real world applications.

## Features
- Create new recipes and share them with everyone
- View recipes based on your location
- Upvote recipes to show your appreciation
- Gain karma points when you upvote or create new recipes

## TechStack
- Reactjs, Maretial UI for frontend
- Opal for authorisation (authZ)
- Nodejs (Express) for backend
- MySQL for database
- Prisma for ORM
- axios to fetch data

## Installation
To install and run this project, we have three services to start, follow these steps to run the project locally

1. **Clone the repository**
   ```bash
    git clone https://github.com/sonu2164/keeper_opal_auth_quira_submission.git
    cd keeper_opal_auth_quira_submission
    ```
   
2. **Start the OPAL Service**
   The opal service uses `docker-compose.yml` and `Dockerfile` to start and initialize instances of
   - mysql server ( host: "example_db", user: "root", password: "mysql", db: "test", port: 3306 )
   - adminer ( port: 8083 , to explore database )
   - opal server ( port: 7002, which uses MySQLFetchProvider to fetch data which is written in src directory and uses github repo to fetch policies )
   - opal client ( port: 8181 )

   Before running this service, make sure you upload the policy.rego file in a separate github repo and add its url in `docker-compose.yml`
   To run these services, execute the following command in root directory of the project containing `docker-compose.yml`
   ```bash
   docker compose up
   ```
   
3. **Start the server**
   Before starting server make sure that OPAL service is up and then create a `.env` file in `server` directory and paste following code into it.
   ```
   DATABASE_URL=mysql://root:mysql@localhost:3306/test
   ```
   This url is based on configs mentioned in `docker-compose.yml`, you can change it accordingly.

   Now execute the following commands in your `server` directory to start the server:
   ```bash
   npm install
   npm run prisma:migrate
   npm run dev
   ```
   Now our server will start at `http://localhost:3001`

   
7. **Start the client**
   Before starting client make sure that server is up and then run following commands in `client` directory to start the client:
   ```bash
   npm install
   npm start
   ```
   Now our client will start at `http://localhost:3000`

## Usage

You can run the client at `http://localhost:3000`
- Initially every logged in user will have **Foodie** role with 0 karma and "India" as default country.
- Every Foodie user can view recipe of same country of his current location, you can change you current location from navbar.
- A Foodie user cannot upvote to any of recipes
- After adding a recipe in app, user will be given **Chef** role with increase in karma by 50.
- A chef can view recipe of all the countries
- A chef can upvote any recipe, also upvoting a recipe increases karma by 10

You can explore your mysql database through adminer using `http://localhost:8083`

You can check OPA cache data by making a GET request to url `http://localhost:8181/v1/data`

You can check your current policies by making a GET request to url `http://localhost:7002/policy`

You can publish a data update event by making a POST request to url `http://localhost:7002/data/config` with sending entries object as body


## Project Structure
```
keeper_opal_auth_quira_submission
├── client/
├── server/
├── sql/
├── src/
├── .gitignore
├── .pre-commit-config.yaml
├── docker-compose.yml
├── Dockerfile
├── gunicorn_conf.py
├── LICENSE
├── Makefile
├── MANIFEST.in
├── rbac.rego
├── pyproject.toml
├── README.md
├── setup.py
├── start.sh
└── wait-for.sh
```

## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or improvements, please create a pull request or open an issue.

1. **Fork the Repository**: Click the "Fork" button at the top right of this page.
2. **Clone the Fork**: 
    ```bash
    git clone https://github.com/yourusername/keeper_opal_auth_quira_submission.git
    ```
3. **Create a Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4. **Make Your Changes**: Commit your changes and push to your fork.
5. **Create a Pull Request**: Submit a pull request detailing your changes.

## License
This project is licensed under the Apache License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements
Special thanks to @bhimeshagrawal for his contribution to the MySQL fetcher.

