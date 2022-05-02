const Web3 = require('web3');
const dotenv = require('dotenv').config()

class TxMonitor {
    web3;
    web3ws;
    acccount;
    subscription;

    constructor(infura_id, account) {
        this.web3ws  = new Web3(new Web3.providers.WebsocketProvider(process.env.eth_mainnet_wss));
        this.web3    = new Web3(new Web3.providers.HttpProvider(process.env.eth_mainnet_https));
        this.account = account;
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTranscations() {
        console.log('Start watching all pending Tx');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null) {
                        // console.log(tx.from);
                        // Show tx.value > 10 eth 
                        if (this.web3.utils.fromWei(tx.value, 'ether') > 10) {
                            if (this.account == process.env.CONTRACT_ACCOUNT_u){
                                console.log('\n[Uniswap]')
                            }
                            // else if (this.account == process.env.CONTRACT_ACCOUNT_s){
                            //     console.log('\n[Sushiswap]')
                            // }
                            else{
                                console.log(this.account)
                            }

                            console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 6000)
        });
    }
}

let txChecker_u = new TxMonitor(process.env.INFURA_ID, process.env.CONTRACT_ACCOUNT_u)
txChecker_u.subscribe('pendingTransactions');
txChecker_u.watchTranscations();

// let txChecker_s = new TxMonitor(process.env.INFURA_ID, process.env.CONTRACT_ACCOUNT_s)
// txChecker_s.subscribe('pendingTransactions');
// txChecker_s.watchTranscations();