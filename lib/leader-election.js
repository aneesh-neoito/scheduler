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
var LeaderElection_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderElection = void 0;
const common_1 = require("@nestjs/common");
const log_1 = require("@nestjs-nodo/log");
const config_1 = require("@nestjs-nodo/config");
const AWS = require("aws-sdk");
const ms = require("ms");
const node_machine_id_1 = require("node-machine-id");
const dynamo_table_interface_1 = require("./dynamo-table.interface");
const utils_1 = require("@nestjs-nodo/utils");
const scheduler_core_config_dto_1 = require("./scheduler-core-config.dto");
const consts_1 = require("./consts");
let LeaderElection = LeaderElection_1 = class LeaderElection {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.initialized = false;
        this.bindAws();
    }
    async onModuleInit() {
        await this.initialize();
    }
    bindAws() {
        this.dynamoDb = new AWS.DynamoDB({
            httpOptions: {
                timeout: ms(this.config.dynamodb.timeout),
            },
            apiVersion: this.config.dynamodb.version,
            region: this.config.credentials.region,
            endpoint: this.config.dynamodb.endpoint,
            credentials: {
                accessKeyId: this.config.credentials.accessKeyId,
                secretAccessKey: this.config.credentials.secretAccessKey,
            },
        });
    }
    getMachineId() {
        if (this.machineId) {
            return this.machineId;
        }
        if (this.config.options.dbIsolation) {
            this.machineId = node_machine_id_1.machineIdSync().substring(0, 6);
        }
        else {
            this.machineId = '';
        }
        return this.machineId;
    }
    getUniqueTableName() {
        let prefix = this.config.options.dbPrefix.toLocaleLowerCase();
        if (this.config.options.dbIsolation) {
            prefix = [this.APP_NAME, this.NODE_ENV, this.getMachineId()]
                .filter((e) => e)
                .join('-')
                .toLocaleLowerCase();
        }
        const tableName = `${prefix}-${this.constructor.name}`;
        return tableName;
    }
    async findOrCreateTable(tableName) {
        let table = await this.findTable(tableName);
        if (table) {
            return table;
        }
        table = await this.createTable(tableName);
        return table;
    }
    async findTable(tableName) {
        var _a;
        try {
            const table = await this.dynamoDb
                .describeTable({
                TableName: tableName,
            })
                .promise();
            if (((_a = table.Table) === null || _a === void 0 ? void 0 : _a.TableStatus) !== dynamo_table_interface_1.DynamoTableStatusEnum.ACTIVE) {
                throw new Error(`has found the locking table "${tableName}" but its not active`);
            }
            return {
                id: table.Table.TableId,
                arn: table.Table.TableArn,
                status: table.Table.TableStatus,
            };
        }
        catch (e) {
            if (e.code === 'ResourceNotFoundException') {
                return null;
            }
            throw e;
        }
    }
    async createTable(tableName) {
        var _a, _b, _c, _d;
        const params = {
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: 'key',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'key',
                    KeyType: 'HASH',
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        };
        const createdTable = await this.dynamoDb.createTable(params).promise();
        const waiter = await this.dynamoDb
            .waitFor('tableExists', {
            TableName: ((_a = createdTable.TableDescription) === null || _a === void 0 ? void 0 : _a.TableName) || '',
        })
            .promise();
        return {
            id: (_b = waiter.Table) === null || _b === void 0 ? void 0 : _b.TableId,
            arn: (_c = waiter.Table) === null || _c === void 0 ? void 0 : _c.TableArn,
            status: (_d = waiter.Table) === null || _d === void 0 ? void 0 : _d.TableStatus,
        };
    }
    async initialize() {
        if (this.initialized)
            return;
        if (this.initializing)
            return this.initializing;
        this.initializing = (async () => {
            this.initialized = false;
            let retries = 0;
            while (!this.initialized) {
                this.logger.info('initializing...');
                try {
                    this.lockTable = await this.findOrCreateTable(this.getUniqueTableName());
                    this.logger.info(`initialized and linked to locking table: "${this.lockTable.arn}"`);
                    this.initialized = true;
                    break;
                }
                catch (err) {
                    this.logger.error(`failed to initialize`, err);
                    retries = retries + 1;
                    await utils_1.AsyncUtils.sleep(1000);
                }
            }
        })();
        return this.initializing;
    }
    async acquireLock(cronWorker) {
        var _a;
        await this.initialize();
        const lockedRecord = await this.dynamoDb
            .getItem({
            TableName: this.getUniqueTableName(),
            Key: { key: { S: cronWorker.constructor.name } },
        })
            .promise();
        if (!lockedRecord.Item) {
            await this.dynamoDb
                .putItem({
                TableName: this.getUniqueTableName(),
                Item: {
                    key: { S: cronWorker.constructor.name },
                    leaseDuration: {
                        S: `${ms(this.config.options.lockingDuration)}`,
                    },
                    owner: { S: cronWorker.getId() },
                    recordVersionNumber: { S: cronWorker.generateRvn() },
                },
            })
                .promise();
            return;
        }
        await utils_1.AsyncUtils.sleep(+(((_a = lockedRecord.Item) === null || _a === void 0 ? void 0 : _a.leaseDuration.S) || 0));
        await this.dynamoDb
            .putItem({
            TableName: this.getUniqueTableName(),
            ConditionExpression: '#rvn = :rvn',
            ExpressionAttributeNames: { '#rvn': 'recordVersionNumber' },
            ExpressionAttributeValues: {
                ':rvn': { S: lockedRecord.Item.recordVersionNumber.S },
            },
            Item: {
                key: { S: cronWorker.constructor.name },
                leaseDuration: {
                    S: `${ms(this.config.options.lockingDuration)}`,
                },
                owner: { S: cronWorker.getId() },
                recordVersionNumber: { S: cronWorker.generateRvn() },
            },
        })
            .promise();
    }
    async sendHeartBeat(cronWorker) {
        await this.initialize();
        await utils_1.AsyncUtils.sleep(ms(this.config.options.lockingHeartbeat));
        await this.dynamoDb
            .putItem({
            TableName: this.getUniqueTableName(),
            ConditionExpression: '#rvn = :rvn',
            ExpressionAttributeNames: { '#rvn': 'recordVersionNumber' },
            ExpressionAttributeValues: { ':rvn': { S: cronWorker.getRvn() } },
            Item: {
                key: { S: cronWorker.constructor.name },
                leaseDuration: {
                    S: `${ms(this.config.options.lockingDuration)}`,
                },
                owner: { S: cronWorker.getId() },
                recordVersionNumber: { S: cronWorker.generateRvn() },
            },
        })
            .promise();
    }
    async disputeLeadership(cronWorker) {
        await this.initialize();
        const workerName = cronWorker.constructor.name;
        const workerId = cronWorker.getId();
        while (true) {
            try {
                await this.acquireLock(cronWorker);
                cronWorker.isLeader = true;
                this.logger.info(`acquired lock for "${workerName}" (#${workerId})`);
            }
            catch (err) {
                cronWorker.isLeader = false;
                console.error(err);
                this.logger.info(`failed to acquire lock for "${workerName}" (#${workerId})`);
                await utils_1.AsyncUtils.sleep(1000);
                continue;
            }
            while (true) {
                try {
                    await this.sendHeartBeat(cronWorker);
                    cronWorker.isLeader = true;
                    this.logger.info(`renewed lock for "${workerName}" (#${workerId})`);
                }
                catch (err) {
                    cronWorker.isLeader = false;
                    this.logger.error(`failed to renew the lock`, err, {
                        workerName,
                        workerId,
                    });
                    await utils_1.AsyncUtils.sleep(1000);
                    break;
                }
            }
        }
    }
};
__decorate([
    config_1.Env('npm_package_name'),
    __metadata("design:type", String)
], LeaderElection.prototype, "APP_NAME", void 0);
__decorate([
    config_1.Env(),
    __metadata("design:type", String)
], LeaderElection.prototype, "NODE_ENV", void 0);
LeaderElection = LeaderElection_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(consts_1.SCHEDULER_CONFIG)),
    __param(1, log_1.InjectLogger(LeaderElection_1)),
    __metadata("design:paramtypes", [scheduler_core_config_dto_1.SchedulerCoreConfigDto,
        log_1.Logger])
], LeaderElection);
exports.LeaderElection = LeaderElection;
