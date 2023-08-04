"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronWorker = void 0;
const cron_1 = require("cron");
const ms = require("ms");
const uuid_1 = require("uuid");
class CronWorker {
    constructor(scheduler, cronTime) {
        this.scheduler = scheduler;
        this.cronTime = cronTime;
        this.id = uuid_1.v4();
        this.rvn = '';
        this.isLeader = false;
        this.isRunning = false;
        this.cronTime = cronTime;
        scheduler.register(this);
    }
    getId() {
        return this.id;
    }
    async start(runOnInit = false) {
        this.cronJob = new cron_1.CronJob({
            cronTime: this.cronTime,
            runOnInit,
            onTick: this.onTick,
            context: this,
            utcOffset: 0,
        });
        this.cronJob.start();
    }
    async onTick() {
        if (!this.isLeader) {
            return;
        }
        setTimeout(async () => {
            if (!this.isRunning) {
                return;
            }
            this.scheduler
                .getLogger()
                .warn(`Operation timed out ${this.scheduler.config.options.workerTimeout}`);
            this.isLeader = false;
            // TODO: abort
        }, ms(this.scheduler.config.options.workerTimeout));
        try {
            this.isRunning = true;
            this.scheduler
                .getLogger()
                .info(`${this.constructor.name} (#${this.getId()}) running`);
            await this.run();
            this.isRunning = false;
        }
        catch (e) {
            this.scheduler.getLogger().error(`Failed to run: ${e.toString()}`, e);
        }
    }
    generateRvn() {
        this.rvn = uuid_1.v4();
        return this.rvn;
    }
    getRvn() {
        return this.rvn;
    }
}
exports.CronWorker = CronWorker;
