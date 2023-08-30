const web3 = require( "@solana/web3.js") // importing web3 Library
const bs58= require("bs58") // For decoding base 58 format
async function SendSolana() {
  try {
    // Wallet private key
    const privateKey = "3qFqjrAXoSFb3MaUHnBuoT78JvHBfFjK3y2PdZtb1UzzoFHEeRz77Jtcfe72pCTNFj6aBp58NdjkiDKQDmoVM976"
    // Creating a signer via a private key by decoding private key through base 58
    const sender = web3.Keypair.fromSecretKey(bs58.decode(privateKey));

    // Receiver address
    const receiver = new web3.PublicKey("2ENUAeqhyqrJMXY8Zv5vYdCJ2JhaifjER349mDgn7mCU");
    // Generate a random address to send to
    const network = "https://api.devnet.solana.com";

    // Connecting to solana devnet network
    const connection = new web3.Connection(network);

    // Object required for transfer function. This converts and fills all the instructions property in the transaction object.
    const transactionData = web3.SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver,
      lamports: 0.1 * 10 ** 9,
    });
    const transaction = new web3.Transaction().add(transactionData);
    // Latest block hash is required to send the transaction
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    // set the feepayer of the transaction. It can also be receiver.
    transaction.feePayer = sender.publicKey;
    //console.log(transaction);
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [sender]
    );
    // Getting signature from devnet solana.
    await connection.getSignatureStatus(signature);
    console.log(signature);
  } catch (error) {
    console.log(error)
  }
}


SendSolana();
