const {
	Client,
	Wallet,
	Transaction,
	Message,
	Coin,
	Fee,
} = require("@bandprotocol/bandchain.js");
const fs = require("fs");
const path = require("path");

// Setup the client
const grpcURL = "https://laozi-testnet6.bandchain.org/grpc-web";
const client = new Client(grpcURL);

async function createDataSource() {
	// Setup the wallet
	const { PrivateKey } = Wallet;
	const mnemonic = process.env.MNEMONIC;
	const privateKey = PrivateKey.fromMnemonic(mnemonic);
	const publicKey = privateKey.toPubkey();
	const sender = publicKey.toAddress().toAccBech32();

	// Setup the transaction's properties∂
	const chainId = await client.getChainId();
	const execPath = path.resolve(__dirname, "data_source.py");
	const file = fs.readFileSync(execPath, "utf8");
	const executable = Buffer.from(file).toString("base64");

	let feeCoin = new Coin();
	feeCoin.setDenom("uband");
	feeCoin.setAmount("50000");

	const requestMessage = new Message.MsgCreateDataSource(
		"Hello World!", // Data source name
		executable, // Data source executable
		sender, // Treasury address
		sender, // Owner address
		sender, // Sender address
		[feeCoin], // Fee
		"" // Data source description
	);

	// Construct the transaction
	const fee = new Fee();
	fee.setAmountList([feeCoin]);
	fee.setGasLimit(1000000);

	const txn = new Transaction();
	txn.withMessages(requestMessage);
	await txn.withSender(client, sender);
	txn.withChainId(chainId);
	txn.withFee(fee);
	txn.withMemo("");

	// Sign the transaction
	const signDoc = txn.getSignDoc(publicKey);
	const signature = privateKey.sign(signDoc);
	const txRawBytes = txn.getTxData(signature, publicKey);

	// Broadcast the transaction
	const sendTx = await client.sendTxBlockMode(txRawBytes);

	return sendTx;
}

(async () => {
	console.log(await createDataSource());
})();
