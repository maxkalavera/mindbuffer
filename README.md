## Mindbuffer
App to make annotations with the visuals of a webchat.


## Migrations

To create a new migration:
```
yarn migrator create --name descriptive-name.js
```

if needed add folder to store migrations:

```
yarn migrator create --name descriptive-name.js --folder src/assets/migrations
```

To apply migrations:
```
yarn migrator up
```
