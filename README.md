## Mindbuffer
App to make annotations with the visuals of a Webchat.


## Enviroment settings

| Variables | Description | Type |
|-|-|-|
| MINDBUFFER_ENVIROMENT |  Defines the running enviroment | "development" or "Production" or "testing" |
| MINDBUFFER_DEBUG | Show errors and extra information in the console, if packaging app to testing enviroment and set to true it also shows the window with the graphic interface | "true" or "false" |
| MINDBUFFER_RESET_SETTINGS_STORE | Resets the file that contains settings and runnning data to default values | "true" or "false" |
| MINDBUFFER_APPLY_TESTING_DATA | Drops all database records and replenishes with test data (Only applicable in develoment enviroment)| "true" or "false" |


## Realease a new version

```
npm version minor
git push --follow-tags
```