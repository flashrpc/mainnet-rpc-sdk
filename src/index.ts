import axios from 'axios';

const FLASH_RPC_URL: string = 'https://mainnet-rpc.com/';
const DEFAULT_MAX_DELAY: number = 500; // 500ms

function toBuffer(rawTransaction: Buffer | Uint8Array | Array<number>): Buffer {
  if (rawTransaction instanceof Buffer) {
    return rawTransaction;
  }
  return Buffer.from(rawTransaction);
}

export async function sendTransaction(rawTransaction: Buffer | Uint8Array | Array<number>, maxDelayMs: number = DEFAULT_MAX_DELAY) {
  const encodedTransaction = toBuffer(rawTransaction).toString('base64');
  const payload = {
    jsonrpc: '2.0',
    method: 'sendTransaction',
    params: [encodedTransaction, {
      encoding: 'base64',
    }],
    id: 1
  };
  try {
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, maxDelayMs));
    const axiosPromise = axios.post(FLASH_RPC_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    await Promise.race([timeoutPromise, axiosPromise]);
  } catch (error) {
    console.log('Flashrpc err:', error);
    return;
  }
}

export default { sendTransaction };
