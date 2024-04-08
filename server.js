// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://abdulkaiyum:abdulkaiyum5426@cluster0.rw16snz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define bank account schema
const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

// Create bank account model
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

// Routes

// Create a new bank account
app.post('/api/bank-accounts', async (req, res) => {
  try {
    const { accountNumber, balance } = req.body;
    const bankAccount = new BankAccount({ accountNumber, balance });
    await bankAccount.save();
    res.status(201).send(bankAccount);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all bank accounts
app.get('/api/bank-accounts', async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find();
    res.send(bankAccounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a bank account by account number
app.get('/api/bank-accounts/:accountNumber', async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({ accountNumber: req.params.accountNumber });
    if (!bankAccount) return res.status(404).send('Bank account not found');
    res.send(bankAccount);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a bank account balance
app.put('/api/bank-accounts/:accountNumber', async (req, res) => {
  try {
    const { balance } = req.body;
    const bankAccount = await BankAccount.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      { balance },
      { new: true }
    );
    if (!bankAccount) return res.status(404).send('Bank account not found');
    res.send(bankAccount);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a bank account
app.delete('/api/bank-accounts/:accountNumber', async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOneAndDelete({ accountNumber: req.params.accountNumber });
    if (!bankAccount) return res.status(404).send('Bank account not found');
    res.send(bankAccount);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
