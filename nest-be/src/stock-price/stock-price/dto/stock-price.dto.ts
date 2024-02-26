export class StockPriceDto {
    stock_symbol: string;
    average_price: number;
    updated_at: Date;

    constructor(stockPrice: Partial<StockPriceDto>) {
        Object.assign(this, stockPrice);
    }
}