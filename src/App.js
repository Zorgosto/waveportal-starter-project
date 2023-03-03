import * as React from "react";
import {ethers} from "ethers";
import './App.css';
import abi from './utils/WavePortal.json'

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();

        /*
        * First make sure we have access to the Ethereum object.
        */
        if (!ethereum) {
            console.error("Make sure you have Metamask!");
            return null;
        }

        console.log("We have the Ethereum object", ethereum);
        const accounts = await ethereum.request({method: "eth_accounts"});

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;
        } else {
            console.error("No authorized account found");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default function App() {
    const [currentAccount, setCurrentAccount] = React.useState("");
    const contractAddress = "0x26941a67fCDEeB6Ff2c4893ff7B370e833E55fDc";
    const contractABI = abi.abi
    let [userWaves, setUserWaves] = React.useState(-1);
    const connectWallet = async () => {
        try {
            const ethereum = getEthereumObject();
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        findMetaMaskAccount().then((account) => {
            if (account !== null) {
                setCurrentAccount(account);
            }
        });
    }, []);
    const wave = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());

                /*
                * Execute the actual wave from your smart contract
                */
                const waveTxn = await wavePortalContract.wave();
                console.log("Mining...", waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined -- ", waveTxn.hash);

                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
                setUserWaves(count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getWaves = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await wavePortalContract.getUserWaves();
                console.log("Retrieved user wave count...", count.toNumber());

                setUserWaves(count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mainContainer">

            <div className="dataContainer">
                <div className="header">
                    <span role="img" aria-label="Wave emoji">👋</span> Hey there!
                </div>

                <div className="bio">
                    Hey, this is my ethereum web app where you can send me a wave! You check how often oyu have waived
                    so far.
                </div>

                {/*
                * If there is no currentAccount render this button
                */}
                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                <button className="waveButton" onClick={wave}>
                    Wave at Me
                </button>

                <button className="waveButton" onClick={getWaves}>
                    Show your waves
                </button>
                <div>
                {userWaves >= 0 ? (
                    <div>Your current waves: {userWaves}</div>
                ) : (
                    <div>Click "Show your waves" button to show waves here</div>
                )
                }
                </div>
            </div>
        </div>
    );
}
