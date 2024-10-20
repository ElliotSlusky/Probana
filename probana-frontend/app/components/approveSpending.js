import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';

const ApproveSpending = ({ }) => {
    const contractAddress = "0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52";
    const spenderAddress = "0x7A0aE150F6E03f6B038B673c7B32341496F65f41";
    const amount = ethers.utils.parseUnits("1.0", 18); // Convert 1.0 ETH to wei
    const { primaryWallet } = useDynamicContext();
    const [txnHash, setTxnHash] = useState('');

    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        // const spender = formData.get('address');
        // const amountToApprove = formData.get('amount');

        const publicClient = await primaryWallet.getPublicClient();
        const walletClient = await primaryWallet.getWalletClient();

        // Define the ABI of the contract function you want to call
        const abi = [
            "function approve(address spender, uint256 amount) public returns (bool)"
        ];
        const iface = new ethers.utils.Interface(abi);

        // Encode the function call
        const data = iface.encodeFunctionData("approve", [spenderAddress, amount]);

        const transaction = {
            to: contractAddress,
            data: data,
        };

        const hash = await walletClient.sendTransaction(transaction);
        setTxnHash(hash);

        const receipt = await publicClient.getTransactionReceipt({
            hash,
        });

        console.log(receipt);
    };

    return (
        <form onSubmit={onSubmit}>
            {/* <p>Approve Spending</p> */}
            {/* <input name="address" type="text" required placeholder="Spender Address" defaultValue={spenderAddress} />
            <input name="amount" type="text" required placeholder="Amount" defaultValue={amount} /> */}
            <button type="submit" className="bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md">
                Approve
            </button>
            {/* <span data-testid="transaction-section-result-hash">{txnHash}</span> */}
        </form>
    );
};

export default ApproveSpending;
