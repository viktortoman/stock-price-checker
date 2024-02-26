import {Controller, Get, HttpException, NotFoundException, Param, Put} from '@nestjs/common';
import {StockPriceService} from './stock-price.service';
import {ApiProperty, ApiTags} from "@nestjs/swagger";
import {StockPrice} from "./entities/stock-price.entity";
import {StockPriceDto} from "./dto/stock-price.dto";

@ApiTags('stock')
@Controller('stock')
export class StockPriceController {
    constructor(private readonly stockPriceService: StockPriceService) {
    }

    @Get('/all')
    async findAll(): Promise<StockPrice[]> {
        return await this.stockPriceService.findAll();
    }

    @Get('/:symbol')
    @ApiProperty({type: String, description: 'symbol'})
    async findBySymbol(@Param('symbol') symbol: string): Promise<StockPriceDto> {
        const stockPrice = await this.stockPriceService.findBySymbolAndGetAverage(symbol);

        if (!stockPrice) {
            throw new NotFoundException('Stock price does not exist!');
        } else {
            return stockPrice;
        }
    }

    @Put('/:symbol')
    @ApiProperty({type: String, description: 'symbol'})
    async update(@Param('symbol') symbol: string) {
        if (!await this.stockPriceService.findBySymbol(symbol)) {
            throw new NotFoundException('Stock price does not exist!');
        }

        const isStarted = this.stockPriceService.update(symbol);

        return {
            message: `Stock price cron job started for ${symbol}`,
            isStarted: isStarted
        };
    }

    @Get('/finnhub/symbols')
    async getSymbolsFromFinnhub() {
        try {
            return await this.stockPriceService.getSymbolsFromFinnhub();
        } catch (err) {
            throw new HttpException(err.response.data, err.response.status);
        }
    }

    @Get('/finnhub/:symbol')
    @ApiProperty({type: String, description: 'symbol'})
    async getStockPriceDataFromFinnhub(@Param('symbol') symbol: string) {
        try {
            return await this.stockPriceService.getStockPriceDataFromFinnhub(symbol);
        } catch (err) {
            throw new HttpException(err.response.data, err.response.status);
        }
    }
}
