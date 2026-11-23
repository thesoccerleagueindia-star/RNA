import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "store.json");

export type Registration = {
  id: string;
  playerName: string;
  city: string;
  age: number;
  category: string;
  interest: "Clinic" | "Camp";
  guardianName: string;
  guardianContact: string;
  playerContact?: string;
  promoCode?: string | null;
  feeBase: number;
  discount: number;
  feePayable: number;
  status: "pending_payment" | "confirmed" | "waitlisted" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentProvider?: string;
  paymentId?: string;
  createdAt: string;
  confirmedAt?: string;
};

export type WaitlistEntry = {
  id: string;
  playerName: string;
  city: string;
  age: number;
  interest: string;
  email: string;
  phone: string;
  level?: string;
  createdAt: string;
};

export type PromoRedemption = {
  code: string;
  registrationId: string;
  discount: number;
  feePayable: number;
  at: string;
  mode: string;
};

type StoreShape = {
  registrations: Registration[];
  waitlist: WaitlistEntry[];
  promoRedemptions: PromoRedemption[];
};

const empty: StoreShape = { registrations: [], waitlist: [], promoRedemptions: [] };

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify(empty, null, 2));
  }
}

export async function readStore(): Promise<StoreShape> {
  await ensure();
  const raw = await fs.readFile(FILE, "utf8");
  return { ...empty, ...JSON.parse(raw) } as StoreShape;
}

export async function writeStore(data: StoreShape) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}
