# RESTful Blockchain API - Udacity Project

Implements a simple private blockchain API with the following API endpoints. The blockchain is initially populated with the Genesis block
on startup.

This project uses the Hapi.js NodeJS framework. More info: https://hapijs.com

## GET localhost:8000/block/{index}

### Example request of GET localhost:8000/block/0 returns a JSON Block object as:

```
{
    "hash": "cbfe84ea4f309eaaf4d9132b87b202be4d0e158f4bdf4a84c9a1e57a26b30334",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1539903719",
    "previousBlockHash": ""
}
```

## POST localhost:8000/block

body: <block data string>

### Example: 

```
	{	
		"body": "Hello World"
	}
```

## Steps

1. Clone the repository to your local computer.
2. Open the terminal and install the packages: `npm install`.
4. Run the application `node app.js`
5. Use Curl or Postman to try out the endpoints.
