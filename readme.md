# Caption Contest API

A Node.js API using the Express framework to retrieve and caption images. Users are able to view a list of images and register in order to leave captions on images. The API uses caching, authorization and authentication, and it also persists data.

Render was used to test production deployment.

## Dependencies

- NodeJS/Express.js
- NPM
- PostgreSQL Server
- Sequelize

Within the project root folder, there is a package.json file. This lists the necessary NPM dependencies. To install them, run `npm install`. This will
create a node_modules folder within your root folder and install the necessary
dependencies. 


 
## Locally running the app

To locally run the project, a postgre database is required:

```
psql -U postgres


postgres-# CREATE ROLE root WITH LOGIN PASSWORD 'passw0rd!'; 
postgres-# ALTER ROLE root CREATEDB;
postgres-# \q


psql -U root

postgres=> CREATE DATABASE node_sequelize;
postgres=> GRANT ALL PRIVILEGES ON DATABASE node_sequelize TO root;
postgres=> \q
```

After the database has been properly set-up, run the sequelize 
migration scripts using `sequelize db:migrate`

You are now able to run the project using `DEBUG=myapp:* npm start`

Once running, the API can be accessed at `http://localhost:3000/`
The project includes static images, which can be accessed through http://localhost:3000/images/<enter_full_file_name.png>


## Testing using Swagger:

Swagger documentation and testing can be accessed at: 
`http://localhost:3000/docs`

Swagger tests:

- Add photos using `GET /photos`
- Create a user using `POST /users`
- Login as a new user `POST /users/login`
- Authorizing Swagger requests:
   - Copy the token that's returned from login
   - Click the Authorize button located at the top
   - Paste the auth token
   - Click Login
- Create a caption using `POST /captions`
 - Retrieve user data, photos and captions using other endpoints
   - Endpoints which have a Lock icon require a login token


## Extensions

- Create an administrative role who can oversee user captions and manage users
- Implement a voting system that aggregates user votes
- Create a monthly winner based on amount of user votes
