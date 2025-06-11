// import { TransactionModel } from "@/modules/transactions/models";
// import { UserModel } from "@/modules/user/models";
// import { Request, Response } from "express";

// export class WebhookController {
//   static async handleDeposit(req: Request, res: Response) {
//     try {
//       const { reference, amount, recipientAccount, status, metadata } =
//         req.body;

//       // Verify webhook signature
//       // ... implement webhook signature verification here

//       const user = await UserModel.findByAccountNumber(recipientAccount);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const transaction = await TransactionModel.findByReference(reference);
//       if (!transaction) {
//         await TransactionModel.create({
//           userId: user.id,
//           type: "DEPOSIT",
//           reference,
//           amount,
//           status,
//           metadata,
//         });

//         if (status === "SUCCESS") {
//           await UserModel.updateBalance(user.id, amount);
//         }
//       }

//       return res
//         .status(200)
//         .json({ message: "Webhook processed successfully" });
//     } catch (error) {
//       console.error("Webhook error:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// }
