# NodeJs Repository for laravel Developers

This is a repository made for developers who are habituated in Laravel and are now shifting to NodeJs.

Fork the repo, clone it and modify as per need

## How to use?
Clone or download the repo and start Building Amazing stuffs

Feel free to [mail me](mailto:me@sulabh.info.np) if any issue is there.

## Documentation

Repository has been made to resemble as much as laravel template but there are few changes which are either done for optimization or could not be avoided

### Major Changes

Instead of `php artisan` we have `npm run`

so `php artisan serve ` is now ` npm run serve`

for production environment `npm run start` is preferred

### Routes

You can create a route in routes folder by running `npm run make:route RouteName`

It will create files in routes folder with the default prefix of snake-cased RouteName in above example it will be `/route-name/`

For routes without prefix web.js is provided inside routes folder

Routes can be defined as
`route.method('/path_name', [middlewares ,]function_to_call)`

- Example

```
route.get('/users', function(req, res){
    res.send('Hello World')
})
```

```
 route.post('/users', middleware1, function(req, res){
     res.send('Hello World')
 })
```

```
 route.put('/users', middleware1, middleware2, function(req, res){
     res.send('Hello World')
 })
```

### Controllers

You can create a controller in App/controllers folder by running `npm run make:controller ControllerName`

Using `async` & `await` in every line is not mandatory but preferred if you are new to asynchronous methodology

for details check the official documentation or my conversation with [ChatGPT](https://chatgpt.com/share/f00fa30e-f550-439e-8dd0-d6c39fd6b155) regarding Asynchronous behaivour of Javascript.


### Middleware

You can create a middleware in App/middlewares folder by running `npm run make:middleware MiddlewareName`

Using `async` & `await` in every line is not mandatory but preferred if you are new to asynchronous methodology

for details check the official documentation or my conversation with [ChatGPT](https://chatgpt.com/share/f00fa30e-f550-439e-8dd0-d6c39fd6b155) regarding Asynchronous behaivour of Javascript.


### Resources

You can create a resource in App/Resources Folder by running `npm run make:resource ResourceName`

This resource is equivalent to Resource of Laravel but unlike laravel `ResourceName(data)` wont work you have to call function like `make()` or `collection()` They serve same purpose as they would in Laravel ;-)

### Requests

You can create a request in App/Requests Folder by running `npm run make:request requestName`

Check the documentation of [Check Requests](https://github.com/sulabh-npl/check_requests-npm) for writing request and a commented sample code is available for the same purpose

to use just require the request and call validate function and pass req and res as parameters



### Models

You can create a Model in Database/Models folder by running `npm run make:model ModelName`

I understand it off bit from laravel's folder structure but hey we are changing

### Creating Migration

You can create a Migration in Database/Migrations folder by running `npm run make:migration MigrationName`

#### Use the following naming styles to get self documentation

`create_(table_name)_table` to create table
`alter_(table_name)_table` to modify table
`drop_(table_name)_table` to delete table
`rename_(table_name)_table` to rename table
`truncate_(table_name)_table` to empty table

#### Writing Migration

If You are not following the styles mentioned above or create a migration file on your own then use the following methods

Step 1: keep table name in constructor inside `super` method

Step 2: do as required

- To Create Table
  ```
  this.createTable({
      field1: 'type',
      field2: 'type any more details'
  });
  ```
- To add column to existing Table
  ```
  this.addColumn({
      field1: 'type',
      field2: 'type any more details'
  }, after_which_column_this_field_is_optional);
  ```
- To Drop/delete Existing Column in Table

  ```
  this.dropColumn('column_name');
  ```

- To Modify/Alter columns in Table
  ```
  this.modifyColumn({
      field1: 'type',
      field2: 'type any more details'
  });
  ```
- To Rename Column

  ```
  this.renameColumn('old_column_name', 'new_column_name');
  ```

- To add Indexes to columns in table

  ```
  this.addIndex('index_name', ['column1', 'column2']);
  ```

- To drop Index

  ```
  this.dropIndex('index_name');
  ```

- To add Foregin Key

  ```
  this.addForeignKey('foreign_key_name', 'column_name', 'referenced_table', 'referenced_column');
  ```

- To Drop Foregin key

  ```
  this.dropForeignKey('foreign_key_name');
  ```

- To Drop Table

  ```
  this.dropTable();
  ```

- To rename table

  ```
  this.renameTable('new_table_name');
  ```

- To empty/truncate table
  ```
  this.truncateTable();
  ```

### Migrating Migrations

You can run the migrations using `npm run migrate [?operations]`

#### Operations

- If no operations are provided then all the unmigrated migrations are migrated
- `fresh` It deletes everything in the database and then create a fresh migration
- `refresh [MigrationName]` It refreshes the specific Migration
- `migration [MigrationName]` It migrates the specific Migration
- `rollback [?MigrationName]` It rollbacks the specific Migration if provvided or all the migrations in previous batch

### Creating Seeders

You can create a Seeder in Database/seeders folder by running `npm run make:seeder SeederName`

#### Using Insert Function

```
    async seed() {
        await this.insert('tableName', {
            fields: ['field1', 'field2'], // optional -default order of fields excluding id, created_at, updated_at
            values: [
                ['value1', 'value2'],
                ['value3', 'value4'],
                [this.fake('name'), this.fake('email')],
            ],
            repeat: 10, // optional- default 1
        });
    }
```

#### Options for this.fake function

The `this.fake` function generates fake data based on the type provided. Below are the available options:

- **name**: Generates a random name.
- **email**: Generates a random email address.
- **password**: Generates a random password.
- **text**: Generates random lorem text.
- **number**: Generates a random number.
- **float**: Generates a random floating-point number.
- **integer**: Generates a random integer.
- **phone**: Generates a random phone number.
- **address**: Generates a random street address.
- **city**: Generates a random city name.
- **country**: Generates a random country name.
- **state**: Generates a random state name.
- **zip**: Generates a random zip code.
- **latitude**: Generates a random latitude.
- **longitude**: Generates a random longitude.
- **url**: Generates a random URL.
- **unique_id**: Generates a random UUID.
- **boolean**: Generates a random boolean value.
- **date**: Generates a random recent date.
- **time**: Generates a random recent time.
- **datetime**: Generates a random recent date and time.
- **default**: Generates a random word.

### Scheduling

- You can schedule the jobs to run in specific intervals by running `npm run schedule`
- To setup the scheduled jobs go to
- `schedule.js` in root folder and code

```
setInterval(function(){
    // Do something or call a function
}, // time in miliseconds);
```


# Authors
| Name | Email | Human |
|-----------|---------|-----------|
| Sulabh Nepal | me@sulabh.info.np | Yes |
| Github Copilot | ashtom@github.com | No |
| Chat GPT | support@openai.com | No |

# Contributers
Open for all

# Also Check
- [Check Requests](https://github.com/sulabh-npl/check_requests-npm)
- [pHTML](https://github.com/sulabh-npl/pHTML)
