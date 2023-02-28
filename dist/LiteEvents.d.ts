export type LiteEventHandler<T> = (data: T) => void | Promise<void>;
export interface ILiteEvent<T> {
    on(handler: LiteEventHandler<T>): void;
    off(handler: LiteEventHandler<T>): void;
    offAll(): void;
    trigger(data: T): void;
}
export declare class LiteEvent<T> implements ILiteEvent<T> {
    private handlers;
    on(handler: LiteEventHandler<T>): void;
    off(handler: LiteEventHandler<T>): void;
    offAll(): void;
    trigger(data: T): Promise<void>;
}
//# sourceMappingURL=LiteEvents.d.ts.map