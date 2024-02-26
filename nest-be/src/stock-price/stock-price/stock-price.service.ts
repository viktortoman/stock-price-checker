import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {StockPrice} from "./entities/stock-price.entity";
import {Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
import {catchError, firstValueFrom, map, Observable} from "rxjs";
import {AxiosResponse} from "axios";
import {CronJob} from "cron";
import {SchedulerRegistry} from "@nestjs/schedule";
import {StockPriceDto} from "./dto/stock-price.dto";

@Injectable()
export class StockPriceService {
    constructor(
        @InjectRepository(StockPrice) private stockPriceRepository: Repository<StockPrice>,
        private readonly httpService: HttpService,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async findAll(): Promise<StockPrice[]> {
        return this.stockPriceRepository.find();
    }

    async findBySymbol(symbol: string): Promise<StockPrice> {
        return this.stockPriceRepository.findOne({
            where: {stock_symbol: symbol}
        });
    }

    async findBySymbolAndGetAverage(symbol: string): Promise<StockPriceDto> {
        const latestRecord = await this.stockPriceRepository.find({
            where: {stock_symbol: symbol},
            order: {date: 'DESC'},
            take: 10,
        });

        const totalPrices = latestRecord.reduce((sum, record) => sum + record.price, 0);

        return new StockPriceDto({
            stock_symbol: symbol,
            average_price: totalPrices / latestRecord.length,
            updated_at: latestRecord[0].updated_at,
        });
    }

    async getStockPriceDataFromFinnhub(symbol: string): Promise<Observable<any>> {
        return this.httpService
            .get(`/quote?symbol=${symbol}`)
            .pipe(
                map((axiosResponse: AxiosResponse) => {
                    return axiosResponse.data;
                }),
            );
    }

    async create(stockPrice: Partial<StockPrice>): Promise<StockPrice> {
        const newStockPrice = this.stockPriceRepository.create(stockPrice);

         return this.stockPriceRepository.save(newStockPrice);
    }

    async getSymbolsFromFinnhub(): Promise<Observable<any>> {
        return this.httpService
            .get(`/stock/symbol?exchange=US`)
            .pipe(
                map((axiosResponse: AxiosResponse) => {
                    return axiosResponse.data.map((d: any) => {
                        return {
                            description: d.description,
                            currency: d.currency,
                            symbol: d.symbol,
                            type: d.type,
                        }
                    });
                })
            );
    }

    update(symbol: string) {
        const newJob = new CronJob(`* * * * *`, () => {
            this.task(symbol);
        });

        this.schedulerRegistry.addCronJob('task', newJob);
        newJob.start();

        return newJob.running;
    }

    private task(symbol: string) {
        this.getStockPriceDataFromFinnhub(symbol).then(r => {
            firstValueFrom(r).then(data => {
                this.create({
                    stock_symbol: symbol,
                    price: data.c,
                    date: new Date(data.t * 1000)
                }).then(() => {
                    console.log('Stock price data saved');
                });
            });
        });
    }
}
