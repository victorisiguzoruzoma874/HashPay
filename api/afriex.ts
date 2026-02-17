
const AFRIEX_BASE_URL = import.meta.env.VITE_AFRIEX_BASE_URL || 'https://api.afriwallet.io/v1';
const AFRIEX_SECRET_KEY = import.meta.env.VITE_AFRIEX_SECRET_KEY || 'YOUR_AFRIEX_SECRET_KEY';

export const afriexClient = {
    initiateTransfer: async (data: {
        amount: number;
        currency: string;
        recipient_address: string;
        recipient_name: string;
        description?: string;
    }) => {
        try {
            const response = await fetch(`${AFRIEX_BASE_URL}/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AFRIEX_SECRET_KEY}`
                },
                body: JSON.stringify({
                    ...data,
                    payment_method: 'bank_transfer', // or 'mobile_money'
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Afriex Transfer Initiation Failed');
            }

            return response.json();
        } catch (error) {
            console.error('Afriex API Error:', error);
            throw error;
        }
    },

    getTransferStatus: async (transactionId: string) => {
        try {
            const response = await fetch(`${AFRIEX_BASE_URL}/payments/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${AFRIEX_SECRET_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Afriex transfer status');
            }

            return response.json();
        } catch (error) {
            console.error('Afriex API Error:', error);
            throw error;
        }
    },

    getFiatBalance: async (currency: string = 'NGN') => {
        // Simulated Afriex Balance Fetch
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                total_balance: currency === 'NGN' ? 45290.00 : 0,
                checking: 12840.50,
                savings: 32449.50,
                currency: currency,
                last_updated: '2 minutes ago'
            };
        } catch (error) {
            console.error('Afriex Balance Fetch Error:', error);
            throw error;
        }
    },

    getAccountMetrics: async () => {
        // Simulated Metrics for the Weekly Trend chart
        return {
            trend: [20, 45, 28, 80, 40, 55, 70],
            percentage_change: '+2.4%'
        };
    },

    getTransactions: async (accountId: string) => {
        // Simulated Transaction History
        return [
            { id: 'tx1', type: 'debit', amount: 5000, recipient: 'Netflix Nigeria', date: 'Today, 10:30 AM', icon: 'subscriptions' },
            { id: 'tx2', type: 'credit', amount: 150000, recipient: 'Salary Deposit', date: 'Yesterday', icon: 'work' },
            { id: 'tx3', type: 'debit', amount: 2500, recipient: 'MTN Airtime', date: '2 days ago', icon: 'phone_iphone' },
        ];
    },

    getSavingsGoals: async () => {
        return [
            { id: 'goal1', name: 'New Laptop', current: 450000, target: 800000, color: '#2176ff' },
            { id: 'goal2', name: 'Holiday Fund', current: 120000, target: 200000, color: '#22c55e' },
            { id: 'goal3', name: 'Emergency Fund', current: 50000, target: 500000, color: '#f59e0b' },
        ];
    },

    getVirtualCards: async () => {
        return [
            { id: 'card1', type: 'Virtual Platinum', balance: 5000, limit: 10000, status: 'Active', number: '5432 12** **** 1234', expiry: '12/26', cvv: '***' }
        ];
    }
};
