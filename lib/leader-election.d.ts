import { OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs-nodo/log';
import { CronWorker } from './cron-worker';
import { SchedulerCoreConfigDto } from './scheduler-core-config.dto';
export declare class LeaderElection implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private APP_NAME;
    private NODE_ENV;
    private machineId;
    private dynamoDb;
    private lockTable;
    private initialized;
    private initializing?;
    constructor(config: SchedulerCoreConfigDto, logger: Logger);
    onModuleInit(): Promise<void>;
    private bindAws;
    private getMachineId;
    private getUniqueTableName;
    private findOrCreateTable;
    private findTable;
    private createTable;
    initialize(): Promise<void>;
    private acquireLock;
    private sendHeartBeat;
    disputeLeadership(cronWorker: CronWorker): Promise<void>;
}
