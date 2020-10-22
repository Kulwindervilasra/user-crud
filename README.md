# Node Server


## Installation

Clone repo in your local system. Run the following command to install dependencies.


```bash
npm install
```

## Running server

Create `.env ` file and add following variables to it.

```python
JWT_SECRET="YOUR_SECRET_HERE"
MONGOURL="Mongo db url"
Example
MONGOURL=mongodb://localhost:27017/test
```
Run following commands to start server.
```bash
npm run build
npm start
```


## Deployment
There are various cloud services provide hosting. Choose according to your requirement.

[Click here to see how to deploy node server on horuku](https://devcenter.heroku.com/articles/deploying-nodejs)

