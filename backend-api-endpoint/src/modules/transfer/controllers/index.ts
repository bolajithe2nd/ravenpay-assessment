// import { Request, Response } from "express";

// export class TransferController {
//   static async transfer(req: AuthRequest, res: Response) {
//     try {
//       const { amount, bankCode, accountNumber, narration } = req.body;
//       const user = req.user;

//       if (user.balance < amount) {
//         return res.status(400).json({ message: "Insufficient balance" });
//       }

//       const ravenApi = new RavenApi();
//       const transfer = await ravenApi.initiateTransfer({
//         amount,
//         bankCode,
//         accountNumber,
//         narration,
//       });

//       await TransactionModel.create({
//         userId: user.id,
//         type: "TRANSFER",
//         reference: transfer.reference,
//         amount,
//         recipientBank: transfer.bankName,
//         recipientAccount: accountNumber,
//         status: "PENDING",
//       });

//       await UserModel.updateBalance(user.id, -amount);

//       return res.status(200).json({
//         message: "Transfer initiated successfully",
//         reference: transfer.reference,
//       });
//     } catch (error) {
//       return res.status(500).json({ message: "Transfer failed" });
//     }
//   }

//   static async getTransactions(req: AuthRequest, res: Response) {
//     try {
//       const transactions = await TransactionModel.findByUserId(req.user.id);
//       return res.json(transactions);
//     } catch (error) {
//       return res.status(500).json({ message: "Could not fetch transactions" });
//     }
//   }
// }
