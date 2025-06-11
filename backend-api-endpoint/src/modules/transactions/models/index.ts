// import db from "@/lib/db";

// export interface Transaction {
//   id: string;
//   userId: string;
//   type: "DEPOSIT" | "TRANSFER";
//   reference: string;
//   amount: number;
//   senderBank?: string;
//   senderName?: string;
//   recipientBank?: string;
//   recipientName?: string;
//   recipientAccount?: string;
//   status: "PENDING" | "SUCCESS" | "FAILED";
//   metadata?: Record<string, any>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class TransactionModel {
//   static async create(
//     data: Omit<Transaction, "id" | "createdAt" | "updatedAt">
//   ): Promise<Transaction> {
//     const [transaction] = await db("transactions").insert(data).returning("*");

//     return transaction;
//   }

//   static async findByUserId(userId: string): Promise<Transaction[]> {
//     return db("transactions").where({ userId }).orderBy("createdAt", "desc");
//   }

//   static async findByReference(reference: string): Promise<Transaction | null> {
//     return db("transactions").where({ reference }).first();
//   }
// }
