import solLogo from "./assets/solana-logo.svg"
import { useState, useEffect } from "react";
import SendSolanaForm from "./components/sendEthForm"; //  Transaction Form
import SpinnerSvg from "./assets/spinnerSvg";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;


function App() {
  const {solana} = window.phantom;
   console.log(solana)
const [phantomInstalled, setPhantomInstalled] = useState(false); // Checks if phantom wallet is installed in browser.
const [accounthash,setAccountHash]= useState(null);
const [error,setError]= useState(false)
const [isProcessing,setIsProcessing]= useState(false)
const isSolanaTestNetEnabled= true


  // Checking if solana is installed 

  function checkIfPhantomInstalled(){
    if(solana){
      if (solana.isPhantom)  setPhantomInstalled(true)
      else setPhantomInstalled(false);
      
    }
  }


  useEffect(() => {
    // Running these two functions on window load.
    checkIfPhantomInstalled();
  }, []);

  // Connects to phantom wallet
  async function connectToPhantom(){
    try {
      const network = "https://api.devnet.solana.com";

      setIsProcessing(true)
      const connect= await solana.connect(network);
      setAccountHash(connect.publicKey.toString());
    } catch (error) {
      setIsProcessing(false)
      setError(error.message)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-3xl p-6 border border-slate-800 rounded-lg bg-slate-950 shadow-xl">
        {/* Image */}
        <img src={solLogo} className="w-32 h-32 mx-auto" alt="Logo" />
        <p className="text-md text-transparent font-semibold bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500 tracking-wide text-center mb-2">Welcome to Solana</p>
        {/* Body */}
        {accounthash ? (
          <div className="mx-4">
            {isSolanaTestNetEnabled
              ? (
                  <SendSolanaForm
                    accountId={accounthash}
                  />
                )
              : (
                  <p className="text-rose-600 text-xs text-center bg-rose-50 border rounded-lg border-rose-200 p-2 font-medium">
                    Metamask is not connected to Goreli network. Please open
                    metamask and connect to Goreli network.
                  </p>
                )}
          </div>
        ) : (
          (
            <div className="w-full max-w-xs mx-auto">
              <p
                className={`text-rose-100 text-xs text-center capitalize animate-pulse bg-red-800 border rounded-lg border-red-600 p-2 font-medium ${
                  error ? "block" : "hidden"
                }`}
              >
                {error}
              </p>
              {/* Button */}
              {phantomInstalled ? (
                <button
                  onClick={connectToPhantom}
                  className="w-full mt-4 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 p-2 py-4 text-white font-semibold hover:bg-violet-400 duration-200"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <p>Processing</p>
                      <SpinnerSvg />
                    </div>
                  ) : (
                    "Connect To Phantom"
                  )}
                </button>
              ) : (
                (
                  <p className="text-medium font-semibold text-zinc-500 text-center">
                    Phantom wallet Extension is not installed. Please install it via
                    this
                    <a
                      className="text-violet-500"
                      href="https://phantom.app/download"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {" "}
                      Link.
                    </a>
                  </p>
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
