import { CronJob } from 'cron';
import { Scheduler } from './scheduler';
export declare abstract class CronWorker {
    readonly scheduler: Scheduler;
    readonly cronTime: any;
    private readonly id;
    private rvn;
    private isRunning;
    cronJob: CronJob;
    isLeader: boolean;
    constructor(scheduler: Scheduler, cronTime: any);
    getId(): string;
    start(runOnInit?: boolean): Promise<void>;
    private onTick;
    generateRvn(): string;
    getRvn(): string;
    abstract run(): Promise<void>;
}
