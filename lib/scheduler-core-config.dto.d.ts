export declare class SchedulerCoreConfigCredentialsDto {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}
export declare class SchedulerCoreConfigApiDto {
    timeout: string;
    version: string;
    endpoint?: string;
}
export declare class SchedulerConfigOptionsDto {
    lockingDuration: string;
    lockingHeartbeat: string;
    dbIsolation: boolean;
    dbPrefix: string;
    workerTimeout: string;
}
export declare class SchedulerCoreConfigDto {
    credentials: SchedulerCoreConfigCredentialsDto;
    dynamodb: SchedulerCoreConfigApiDto;
    options: SchedulerConfigOptionsDto;
}
