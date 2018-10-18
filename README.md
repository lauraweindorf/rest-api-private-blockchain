# RESTful Blockchain API - Udacity Project

IN PROGRESS!

Implements a simple private blockchain API with the endpoints below. 

The blockchain is initially populated with the Genesis block on startup.

This project uses the Hapi.js NodeJS framework. More info: https://hapijs.com

Packages:
- hapi
- crypto-js/sha256
- Boom

## GET http://localhost:8000/block/{index}

### Example JSON response:

	GET http://localhost:8000/block/0

```
{
    "hash": "cbfe84ea4f309eaaf4d9132b87b202be4d0e158f4bdf4a84c9a1e57a26b30334",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1539903719",
    "previousBlockHash": ""
}
```

## POST http://localhost:8000/block

```
{
	"body":	"data"
}
```

### Example: 

```
	{	
		"body": "Hello World"
	}
```

## Steps

1. Clone the repository.
2. Open the terminal and install the packages: `npm install`.
4. Run the application `node app.js`
5. Use Curl or Postman to try out the endpoints.
