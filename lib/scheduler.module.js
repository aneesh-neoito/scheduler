"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SchedulerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const common_1 = require("@nestjs/common");
const log_1 = require("@nestjs-nodo/log");
const leader_election_1 = require("./leader-election");
const scheduler_1 = require("./scheduler");
const scheduler_core_module_1 = require("./scheduler-core.module");
const scheduler_core_config_dto_1 = require("./scheduler-core-config.dto");
let SchedulerModule = SchedulerModule_1 = class SchedulerModule {
    static forRoot(configMap = scheduler_core_config_dto_1.SchedulerCoreConfigDto) {
        return {
            global: true,
            module: SchedulerModule_1,
            imports: [
                scheduler_core_module_1.SchedulerCoreModule.forRoot(configMap),
                log_1.LogModule.forFeature(scheduler_1.Scheduler, leader_election_1.LeaderElection)
            ],
            providers: [scheduler_1.Scheduler, leader_election_1.LeaderElection],
            exports: [scheduler_1.Scheduler],
        };
    }
};
SchedulerModule = SchedulerModule_1 = __decorate([
    common_1.Module({})
], SchedulerModule);
exports.SchedulerModule = SchedulerModule;
