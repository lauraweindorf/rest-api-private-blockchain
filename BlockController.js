/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

/* ===== Configure to use LevelDB as the data access layer  ================= */

const level = require('level');
const privateBlockchain = './private-blockchain';
const db = level(privateBlockchain);

/* ===== RESTful API Project stuff ===== */

const GENESIS = 'rest-api-private-blockchain Udacity Project - Genesis block';

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
    constructor(server)
    {
        this.server = server;
        this.ensureGenesisBlock();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    // Adds the genesis block if it doesn't already exist
    async ensureGenesisBlock()
  	{
      try {
        let blockHeight = await this.getBlockHeight();
        if (blockHeight === -1) {
          // Create the genesis block
          var genesis = new BlockClass.Block(GENESIS);
          genesis.hash = SHA256(JSON.stringify(genesis)).toString();

          await this.putBlock(0, genesis);
          blockHeight++;

          console.log(genesis.toLogString('GENESIS Block added!'));
        } else {
          console.log(`BlockHeight = ${blockHeight}`);
        }

        return blockHeight;

      } catch (err) {
        console.log(`FATAL. Can't add genesis block to blockchain: ${err.message}`);
        return boom.badImplementation();
      }
  	}

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex()
    {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (request, reply) => {
              try {
                let block = await this.getBlock(request.params.index);
                return block;

              } catch(err) {
                return boom.badRequest(`Invalid block index: ${request.params.index}`);		// 400
              }
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock()
    {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, reply) => {

              if (request.payload === undefined || request.payload.body === undefined) {
                return boom.badRequest(`Invalid request payload: ${request.payload}`);	//400
              }

              let body = request.payload.body.trim();
        			if (body.length === 0) {
                return boom.badRequest('Invalid request payload: EMPTY');	// 400
              }

            	try {

                let blockAux = new BlockClass.Block();
                blockAux.body = body;

                await this.addBlock(blockAux);

                console.log(`New Block created at height: ${blockAux.height}`);
                console.log(`${JSON.stringify(blockAux)}`);

                return blockAux;

              } catch (err) {
                	return boom.badImplementation(err.message);	// 500
            	}
            }
        });
    }

    // Appends a block to the blockchain
    async addBlock(block)
    {
      try {
        // Make sure GENESIS block gets added
        let blockHeight = await this.ensureGenesisBlock();
        let latestBlock = await this.getBlock(blockHeight);

        block.height = blockHeight + 1;
        block.previousBlockHash = latestBlock.hash;
        block.hash = SHA256(JSON.stringify(block)).toString();

        // Persisting block object to levelDB
        await this.putBlock(block.height, block);

      } catch (err) {
        throw new Error(`unable to add new block: ${err.message}`);
      }
    }

    //
    // LevelDB Data Access layer
    //

    // Get current block height of simpleChain
    getBlockHeight()
    {
      return new Promise((resolve, reject) => {
    		let blockHeight = -1;
    		db.createKeyStream()
    				.on('data', (data) => {
    					blockHeight++;
    				}).on('error', (err) => {
    					reject(`getBlockHeight: ${err.message}`);
    				}).on('close', () => {
              resolve(blockHeight);
    				});
    	});
    }

    // Get block at blockHeight value
    getBlock(blockHeight)
    {
      return new Promise((resolve, reject) => {
    		db.get(blockHeight)
    			.then((blockValue) => {
    				resolve(JSON.parse(blockValue));
    			}).catch((errmsg) => {
    				reject(`getBlock: ${errmsg}`);
    			});
    		});
    }

    // Put block data
    putBlock(blockHeight, block)
    {
      let blockValue = JSON.stringify(block);

      return new Promise((resolve, reject) => {
        db.put(blockHeight, blockValue)
          .then(() => {
            resolve();
          })
          .catch((errmsg) => {
            reject(`db.put: ${errmsg}`);
          });
      });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server
 */
module.exports = (server) => { return new BlockController(server) }
