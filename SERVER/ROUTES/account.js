const express = require("express");
const router = express.Router();
const { Account } = require("../DATABASE/db");
const { authMiddleware } = require("../MIDDLEWARE/MIddleware");
const mongoose = require("mongoose");

// Get balance route
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error retrieving balance:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Transfer route
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { amount, to } = req.body;
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Recipient account not found" });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        console.error("Error transferring funds:", error);
        await session.abortTransaction();
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
});

module.exports = router;
