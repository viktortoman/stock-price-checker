import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('stock_prices')
export class StockPrice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stock_symbol: string;

    @Column()
    price: number;

    @Column()
    date: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
