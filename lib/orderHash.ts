import crypto from 'crypto';

const secret = process.env.ORDER_HASH_SECRET || 'mysecret';

export function encodeOrderId(id: number) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(id.toString())
    .digest('hex');
  return `${id}-${hash.slice(0, 8)}`;
}

export function decodeOrderId(encoded: string): number | null {
  const [idStr, hash] = encoded.split('-');
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(idStr)
    .digest('hex')
    .slice(0, 8);
  if (hash !== expectedHash) return null;
  return Number(idStr);
}
