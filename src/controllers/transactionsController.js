import { SQL } from '../config/db.js';


export async function getTransactionsById(req, res) {
    try {
            const { userId } = req.params;
    
            // Validate userId
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid userId' });
            }
    
            const transactions = await SQL`
                SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `;
    
            res.status(200).json(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
}

export async function createTransaction(req, res){

        try {
            const { title, amount, category, user_id } = req.body;
            if (!title || !user_id || !category || amount === undefined) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            const transaction = await SQL`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *
            `
            // console.log('Transaction created:', transaction);
            res.status(201).json(transaction[0]);
    
    
    
    
    
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    
}

export async function deleteTransaction(req, res) {
    try {
            const { id } = req.params;
    
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid transaction ID' });
            }
    
            const deletedTransaction = await SQL`
                DELETE FROM transactions WHERE id = ${id} RETURNING *
            `;
    
            if (deletedTransaction.length === 0) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
    
            res.status(200).json({ message: 'Transaction deleted successfully'});
    
            
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
}

export async function getTransactionsSummary (req,res) {
    try {
        const { userId } = req.params;
        // if (isNaN(userId)) {
        //     return res.status(400).json({ error: 'Invalid userId' });
        // }

        const balanceResult = await SQL`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await SQL`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;



        const expenseResult = await SQL`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses,
        })



    } catch (error) {
        console.error('Error fetching transactions summary:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}
