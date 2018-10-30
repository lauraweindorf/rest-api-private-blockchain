
/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block
{
	constructor(data)
  {
     this.hash = '';
     this.height = 0;
     this.body = data;
		 this.time = new Date().getTime().toString().slice(0,-3);
     this.previousBlockHash = '';
   }

   toLogString(msg)
   {
     let blockString = (msg === undefined) ? '' : `${msg}\n`;

     blockString +=
      `block.height = ${this.height}\n` +
      `block.body = ${this.body}\n` +
      `block.hash = ${this.hash}\n` +
      `block.time = ${this.time}\n` +
      `block.previousBlockHash = ${this.previousBlockHash}\n`;

      return blockString;
   }
}

module.exports.Block = Block;
