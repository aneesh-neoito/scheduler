"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SchedulerCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerCoreModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs-nodo/config");
const consts_1 = require("./consts");
let SchedulerCoreModule = SchedulerCoreModule_1 = class SchedulerCoreModule {
    static forRoot(configMap) {
        return {
            module: SchedulerCoreModule_1,
            imports: [
                config_1.ConfigModule.forFeature(configMap),
            ],
            providers: [
                {
                    provide: consts_1.SCHEDULER_CONFIG,
                    inject: [config_1.getConfigToken(configMap)],
                    useFactory: (value) => value,
                }
            ],
            exports: [consts_1.SCHEDULER_CONFIG],
        };
    }
};
SchedulerCoreModule = SchedulerCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], SchedulerCoreModule);
exports.SchedulerCoreModule = SchedulerCoreModule;
