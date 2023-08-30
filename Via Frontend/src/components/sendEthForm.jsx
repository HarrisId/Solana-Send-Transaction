import React from "react";
import { useState } from "react";
import httpRequest from "../axios/baseURL"; // axios request
import SpinnerSvg from "../assets/spinnerSvg"; // Processing SVG
import * as web3 from '@solana/web3.js';

function SendSolanaForm({ accountId, accBalance }) {
  const [receiverAddress, setReceiverAddress] = useState(""); // Getting receiver address from user
  const [solValue, setSolValue] = useState(0); // Amount by user
  const [transactionDetails, setTransactionDetails] = useState({}); // Transaction details by ETH RPC API call
  const [viewTransaction, setViewTransaction] = useState(false); 
  const [error, setError] = useState(false); // for displaying error message
  const [isProcessing, setIsProcessing] = useState(false); // processing state

  // Function to perform Solana transaction
  async function sendSolana(e) {
    setIsProcessing(true)
    e.preventDefault();
    try {
      const provider = window.phantom?.solana; // Phantom wallet provider
    const network="https://api.devnet.solana.com" // Devnet also considered as testnet of solana
    const connection = new web3.Connection(network); // Creating a connection instance to devnet with web3
    const sender= new web3.PublicKey(accountId);
    const receiver= new web3.PublicKey(receiverAddress);
    const transactionData= web3.SystemProgram.transfer({
      fromPubkey:sender,
      toPubkey:receiver,
      lamports: solValue*10**9 // Lamports is smallest amount of solana
    })
        // Object required for transfer function. This converts and fills all the instructions property in the transaction object.
     const transaction = new web3.Transaction().add(transactionData)
         // Latest block hash is required to send the transaction
     let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
     transaction.recentBlockhash = blockhash;
         // set the feepayer of the transaction. It can also be receiver.
     transaction.feePayer= sender
     console.log(transaction)
     const { signature } = await provider.signAndSendTransaction(transaction,provider);
  await connection.getSignatureStatus(signature);
  setIsProcessing(false)
  console.log(signature);
    } catch (error) {
      setIsProcessing(false)
      setError(error.message)
        }
    
  }
  // console.log(transactionDetails)
  return (
    <div className=" w-full max-w-2xl">
      <p className=" text-center rounded-lg max-w-lg bg-violet-800 text-cyan-300 tracking-wide font-semibold text-sm p-2 border border-slate-900 my-2 mx-auto">
        {accountId}
      </p>

      {viewTransaction
        ? (
            <div className="border border-slate-800 p-4 w-full bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Transaction hash:
                </p>
                <p className="text-xs text-zinc-500 w-9/12 break-all">
                  {transactionDetails.hash}
                </p>
              </div>

              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Sender:
                </p>
                <p className="text-xs text-zinc-500 w-9/12 break-all">
                  {transactionDetails.from}
                </p>
              </div>
              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Receiver:
                </p>
                <p className="text-xs text-zinc-500 w-9/12 break-all">
                  {transactionDetails.to}
                </p>
              </div>

              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Amount:
                </p>
                <p className="text-xs text-zinc-500 w-9/12 break-all">
                  {solValue} Eth
                </p>
              </div>

              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Gas Price:
                </p>
                
              </div>

              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  Status:
                </p>
                <div className="text-xs text-zinc-500 w-9/12">
                  <p className="bg-green-50 border border-green-200 text-green-500 font-semibold inline p-2 rounded-lg">
                    Success
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4 mb-2">
                <p className="text-zinc-400 text-sm font-semibold w-3/12">
                  View on Eth Explorer:
                </p>
                <a
                  className="text-xs  w-9/12 break-all text-blue-500 hover:text-blue-400"
                  href={`https://goerli.etherscan.io/tx/${transactionDetails.hash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View transaction on Eth Explorer
                </a>
              </div>
              <button
                onClick={() => {
                  setViewTransaction(false);
                }}
                className="bg-violet-500 border w-full text-sm p-2 text-white font-semibold hover:bg-violet-400 duration-200"
              >
                Perform another transaction?
              </button>
            </div>
          )
        : (
            <form
              onSubmit={sendSolana}
              className=" border border-slate-800 rounded-lg p-6 w-full max-w-lg mx-auto shadow-md"
            >
              <label
                className="text-zinc-400 text-sm font-semibold"
                htmlFor="recAddress"
              >
                Receiver's Address
              </label>
              <input
                id="recAddress"
                className="p-2 w-full my-2 border-2 border-slate-800 text-white focus-within:border-violet-500 text-xs focus:outline-none rounded-lg placeholder:text-xs invalid:border-red-500 bg-slate-800"
                placeholder="Enter Receiver Address"
                onChange={(e) => {
                  setReceiverAddress(e.target.value);
                }}
              />
              <label
                className="text-zinc-400 text-sm font-semibold"
                htmlFor="solValue"
              >
                Amount
              </label>
              <input
                type="number"
                step="any"
                id="solValue"
                className="p-2 w-full my-2 border-2 border-slate-800 text-white bg-slate-800 focus-within:border-violet-500 text-xs focus:outline-none rounded-lg placeholder:text-xs"
                placeholder="Enter eth amount"
                onChange={(e) => {
                  setSolValue(e.target.value);
                }}
                required
              />
            
              <p
                className={`text-rose-600 text-xs inline font-medium ${
                  error ? "block" : "hidden"
                }`}
              >
                {error}
              </p>
              <button
                onSubmit={sendSolana}
                className="w-full mt-4 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 p-2 text-white font-semibold hover:from-cyan-400 hover:to-violet-400 transition duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <p>Processing</p>
                    <SpinnerSvg />
                  </div>
                ) : (
                  "Send SOL"
                )}
              </button>
            </form>
          )}
    </div>
  );
}

export default SendSolanaForm;
