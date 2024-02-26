import {IsDate, IsInt, IsString, MinLength} from "class-validator";

export class CreateStockPriceDto {

    @IsString()
    @MinLength(2, {message: "Stock symbol is too short"})
    stock_symbol: string;

    @IsInt()
    price: number;

    @IsDate()
    date: Date;

    @IsDate()
    updated_at: Date;
}