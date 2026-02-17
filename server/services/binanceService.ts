import axios from 'axios';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

export const binanceService = {
    getTicker: async (symbol: string) => {
        try {
            const response = await axios.get(`${BINANCE_API_URL}/ticker/price`, {
                params: { symbol }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ticker for ${symbol}:`, error);
            throw error;
        }
    },

    getRates: async (baseAssets: string[], quoteAsset: string = 'USDT') => {
        try {
            // Map common assets to Binance symbols (e.g., BTC -> BTCUSDT, SUI -> SUIUSDT)
            const symbols = baseAssets.map(asset => `${asset}${quoteAsset}`);

            // Binance doesn't have a multi-symbol ticker price in a single concise endpoint for specific lists
            // but we can fetch all or do individual ones. For simplicity and reliability, we'll fetch individual ones in parallel.
            const ratePromises = symbols.map(symbol =>
                axios.get(`${BINANCE_API_URL}/ticker/price`, { params: { symbol } })
                    .then((res: any) => ({ symbol: res.data.symbol, price: res.data.price }))
                    .catch(() => ({ symbol, price: '---' })) // Fallback for unsupported pairs
            );

            const rates = await Promise.all(ratePromises);
            return rates.reduce((acc: any, rate: any) => {
                acc[rate.symbol] = rate.price;
                return acc;
            }, {});
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            return {};
        }
    }
};
