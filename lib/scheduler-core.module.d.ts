import { DynamicModule } from '@nestjs/common';
import { TConfigMap } from '@nestjs-nodo/config';
import { SchedulerCoreConfigDto } from './scheduler-core-config.dto';
export declare class SchedulerCoreModule {
    static forRoot(configMap: TConfigMap<SchedulerCoreConfigDto>): DynamicModule;
}
