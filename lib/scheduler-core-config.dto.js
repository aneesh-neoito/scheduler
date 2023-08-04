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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerCoreConfigDto = exports.SchedulerConfigOptionsDto = exports.SchedulerCoreConfigApiDto = exports.SchedulerCoreConfigCredentialsDto = void 0;
const class_validator_1 = require("class-validator");
const config_1 = require("@nestjs-nodo/config");
const class_transformer_1 = require("class-transformer");
class SchedulerCoreConfigCredentialsDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerCoreConfigCredentialsDto.prototype, "accessKeyId", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerCoreConfigCredentialsDto.prototype, "secretAccessKey", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerCoreConfigCredentialsDto.prototype, "region", void 0);
exports.SchedulerCoreConfigCredentialsDto = SchedulerCoreConfigCredentialsDto;
class SchedulerCoreConfigApiDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerCoreConfigApiDto.prototype, "timeout", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerCoreConfigApiDto.prototype, "version", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SchedulerCoreConfigApiDto.prototype, "endpoint", void 0);
exports.SchedulerCoreConfigApiDto = SchedulerCoreConfigApiDto;
class SchedulerConfigOptionsDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerConfigOptionsDto.prototype, "lockingDuration", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerConfigOptionsDto.prototype, "lockingHeartbeat", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], SchedulerConfigOptionsDto.prototype, "dbIsolation", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerConfigOptionsDto.prototype, "dbPrefix", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SchedulerConfigOptionsDto.prototype, "workerTimeout", void 0);
exports.SchedulerConfigOptionsDto = SchedulerConfigOptionsDto;
let SchedulerCoreConfigDto = class SchedulerCoreConfigDto {
};
__decorate([
    class_transformer_1.Type(() => SchedulerCoreConfigCredentialsDto),
    class_validator_1.ValidateNested(),
    __metadata("design:type", SchedulerCoreConfigCredentialsDto)
], SchedulerCoreConfigDto.prototype, "credentials", void 0);
__decorate([
    class_transformer_1.Type(() => SchedulerCoreConfigApiDto),
    class_validator_1.ValidateNested(),
    __metadata("design:type", SchedulerCoreConfigApiDto)
], SchedulerCoreConfigDto.prototype, "dynamodb", void 0);
__decorate([
    class_transformer_1.Type(() => SchedulerConfigOptionsDto),
    class_validator_1.ValidateNested(),
    __metadata("design:type", SchedulerConfigOptionsDto)
], SchedulerCoreConfigDto.prototype, "options", void 0);
SchedulerCoreConfigDto = __decorate([
    config_1.Config({ name: 'scheduler' })
], SchedulerCoreConfigDto);
exports.SchedulerCoreConfigDto = SchedulerCoreConfigDto;
