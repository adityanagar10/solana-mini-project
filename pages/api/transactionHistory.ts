import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';

const network = 'https://api.mainnet-beta.solana.com'; // or use a testnet if desired

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { walletAddress } = req.body;

  try {
    const connection = new Connection(network, 'confirmed');
    const publicKey = new PublicKey(walletAddress);

    // Fetch account info
    const account = await connection.getAccountInfo(publicKey);

    // Fetch transaction history
    const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, {
      limit: 10,
    });

    return res.status(200).json({ account, transactions });
  } catch (error) {
    console.error('Error fetching account and transaction history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
