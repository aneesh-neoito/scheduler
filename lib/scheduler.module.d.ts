import { DynamicModule } from '@nestjs/common';
import { TConfigMap } from '@nestjs-nodo/config';
import { SchedulerCoreConfigDto } from './scheduler-core-config.dto';
export declare class SchedulerModule {
    static forRoot(configMap?: TConfigMap<SchedulerCoreConfigDto>): DynamicModule;
}
