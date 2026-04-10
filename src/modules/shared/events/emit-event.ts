import { EventEmitter2 } from '@nestjs/event-emitter';

export async function emitEvent(
  eventEmitter: EventEmitter2,
  event: string | symbol,
  payload: unknown,
): Promise<void> {
  const asyncEmitter = eventEmitter as EventEmitter2 & {
    emitAsync?: (event: string | symbol, payload: unknown) => Promise<unknown>;
  };

  if (typeof asyncEmitter.emitAsync === 'function') {
    await asyncEmitter.emitAsync(event, payload);
    return;
  }

  asyncEmitter.emit(event, payload);
}