import {Module} from '@nestjs/common';
import {StockPriceService} from './stock-price.service';
import {StockPriceController} from './stock-price.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockPrice} from "./entities/stock-price.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        HttpModule.register({
            baseURL: 'https://finnhub.io/api/v1',
            params: {
                token: process.env.FINNHUB_API_KEY
            }
        }),
        TypeOrmModule.forFeature([StockPrice])
    ],
    controllers: [StockPriceController],
    providers: [StockPriceService],
    exports: [StockPriceService]
})
export class StockPriceModule {
}
