import { Logger } from '@nestjs-nodo/log';
import { LeaderElection } from './leader-election';
import { CronWorker } from './cron-worker';
import { SchedulerCoreConfigDto } from './scheduler-core-config.dto';
export declare class Scheduler {
    private readonly logger;
    readonly config: SchedulerCoreConfigDto;
    private readonly leaderElection;
    constructor(logger: Logger, config: SchedulerCoreConfigDto, leaderElection: LeaderElection);
    register(cronWorker: CronWorker): Promise<void>;
    getLogger(): Logger;
}
