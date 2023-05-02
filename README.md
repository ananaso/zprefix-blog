To run this application, you need the following information in your environment variables.
```shell
export POSTGRES_USER=postgres
export POSTGRES_DB=postgres
export POSTGRES_PASSWORD=secret
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export NODE_ENV=development
export REACT_APP_SERVER_HOST=localhost
export REACT_APP_SERVER_PORT=3001
export SERVER_PORT=3001
```

An easy way to do this is to store the env vars in a `.envrc` file and to utilize [direnv](https://direnv.net/) for loading, which can be installed with brew:
```shell
brew install direnv
```

To get the app up and running, the PostgreSQL database, server backend, and app frontend need to be started in succession. This can be done by running the following three commands from the project root:

```shell
# start the database
./start-db.sh
# start the server backend
cd zprefix-blog-server && npm start
# start the app frontend
cd zprefix-blog-app && npm run start-dev
```