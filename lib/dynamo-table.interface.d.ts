export declare enum DynamoTableStatusEnum {
    ACTIVE = "ACTIVE",
    CREATING = "CREATING",
    UPDATING = "UPDATING",
    DELETING = "DELETING"
}
export interface IDynamoTable {
    id?: string;
    arn?: string;
    status?: DynamoTableStatusEnum;
}
