CREATE TABLE `stock_prices`
(
    `id`           int(11) NOT NULL AUTO_INCREMENT,
    `stock_symbol` varchar(10) NULL,
    `price`        decimal(10, 2) NULL,
    `date`         date NULL,
    `updated_at`   date NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;