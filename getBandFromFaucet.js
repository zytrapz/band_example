const BAND_FAUCET_ENDPOINT = "https://laozi-testnet6.bandchain.org/faucet";

async function getFaucet() {
	const body = {
		address: "band1u745s6yndvg500z95jrqfject309qyzwfytepy",
		amount: "100",
	};

	let options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(body),
	};

	// See https://docs.bandchain.org/technical-specifications/band-endpoints.html#laozi-testnet-5
	let response = await fetch(`${BAND_FAUCET_ENDPOINT}`, options);

	console.log(response);
}

getFaucet();
