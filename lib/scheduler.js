"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Scheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const common_1 = require("@nestjs/common");
const log_1 = require("@nestjs-nodo/log");
const leader_election_1 = require("./leader-election");
const utils_1 = require("@nestjs-nodo/utils");
const scheduler_core_config_dto_1 = require("./scheduler-core-config.dto");
const consts_1 = require("./consts");
let Scheduler = Scheduler_1 = class Scheduler {
    constructor(logger, config, leaderElection) {
        this.logger = logger;
        this.config = config;
        this.leaderElection = leaderElection;
    }
    async register(cronWorker) {
        const workerName = cronWorker.constructor.name;
        let registered = false;
        let retries = 0;
        while (!registered) {
            try {
                await cronWorker.start();
                this.logger.info(`${this.constructor.name} registered "${workerName}" worker using "${cronWorker.cronTime}" cron time rule`);
                registered = true;
            }
            catch (err) {
                this.logger.error(`${this.constructor.name} failed to register worker`, err, {
                    workerName,
                    retries,
                });
                retries = retries + 1;
                await utils_1.AsyncUtils.sleep(1000);
            }
        }
        await this.leaderElection.disputeLeadership(cronWorker);
    }
    getLogger() {
        return this.logger;
    }
};
Scheduler = Scheduler_1 = __decorate([
    common_1.Injectable(),
    __param(0, log_1.InjectLogger(Scheduler_1)),
    __param(1, common_1.Inject(consts_1.SCHEDULER_CONFIG)),
    __metadata("design:paramtypes", [log_1.Logger,
        scheduler_core_config_dto_1.SchedulerCoreConfigDto,
        leader_election_1.LeaderElection])
], Scheduler);
exports.Scheduler = Scheduler;
