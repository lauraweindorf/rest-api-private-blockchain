const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const boom = require('Boom');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: (request, reply) => {
 				try {
					let block = this.blocks[request.params.index];

					if (block === undefined)
						throw new boom.badRequest(`Invalid block index: ${index}`);		// 400

					return block;

				} catch(err) {
					throw new Error(err.message);	// 500
				}              
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: (request, reply) => {

				if (request.payload === undefined || request.payload.body === undefined)
					return boom.badRequest(`Invalid request payload: ${request.payload}`);	//400

				let body = request.payload.body.trim();
				if (body.length === 0)
					return boom.badRequest('Invalid request payload: EMPTY');	// 400

				console.log(`POST block data: ${body}`);
            
            	try {
                	let blockAux = new BlockClass.Block();
                	blockAux.body = body;
                	blockAux.height = this.blocks.length;
                	blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                	blockAux.previousBlockHash = this.blocks[this.blocks.length - 1].hash;
                
                	this.blocks.push(blockAux);
                
                	console.log(`New Block created at height: ${blockAux.height}`);
                	console.log(`${JSON.stringify(blockAux)}`);
                
                	return blockAux;

            	} catch (err) {
                	throw new Error(err.message);	// 500
            	}
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
	initializeMockData()
    {
        if(this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {

                let blockAux = new BlockClass.Block();

                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();

                if (index === 0) {
                    blockAux.body = 'First block in the chain - Genesis block';
                } else {
                    blockAux.body = `Test Data #${index}`;
                    blockAux.previousBlockHash = this.blocks[this.blocks.length - 1].hash;
                }

                this.blocks.push(blockAux);
            }
        }
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}
