import type { ApiPromise } from '@polkadot/api';
import type { Signer } from '@polkadot/api/types';

const appName = 'Dotme';

export async function connectWallet() {
	if (typeof window === 'undefined') {
		throw new Error('Wallet connection is only available in the browser');
	}

	const { web3Enable, web3Accounts, web3FromAddress } = await import('@polkadot/extension-dapp');

	const extensions = await web3Enable(appName);
	if (!extensions.length) {
		throw new Error('No wallet extensions found');
	}

	const accounts = await web3Accounts();
	if (!accounts.length) {
		throw new Error('No accounts found in wallet');
	}

	const account = accounts[0];
	const injector = await web3FromAddress(account.address);

	return {
		address: account.address,
		name: account.meta.name,
		signer: injector.signer
	};
}

export async function sendDot(
	fromAddress: string,
	toAddress: string,
	amountDot: number,
	api: ApiPromise | undefined,
	signer: Signer | undefined
) {
	const amount = BigInt(amountDot * 10 ** 12);

	return new Promise<string>((resolve, reject) => {
		const tx = api?.tx.balances.transferKeepAlive(toAddress, amount);

		tx
			?.signAndSend(fromAddress, { signer }, ({ status, dispatchError }) => {
				if (dispatchError) {
					if (dispatchError.isModule) {
						const decoded = api?.registry.findMetaError(dispatchError.asModule);
						reject(`${decoded?.section}.${decoded?.name}: ${decoded?.docs.join(' ')}`);
					} else {
						reject(dispatchError.toString());
					}
				}

				if (status.isInBlock) {
					resolve(`Transaction included at blockHash ${status.asInBlock.toHex()}`);
				}
			})
			.catch(reject);
	});
}
