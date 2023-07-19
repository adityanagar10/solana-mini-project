import web3 from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';

const network = 'https://api.mainnet-beta.solana.com'; // or use a testnet if desired
const LAMPORTS_PER_SOL = 1000000000; // Number of lamports in one SOL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { walletAddress } = req.body;

  try {
    const connection = new web3.Connection(network, 'confirmed');
    const publicKey = new web3.PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL; // Convert balance to SOL
    const formattedBalance = solBalance.toFixed(2); // Format balance to two decimal places

    return res.status(200).json({ balance: formattedBalance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
