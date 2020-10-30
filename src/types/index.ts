export type TypedActionReturnType = { type: string; payload?: any };

export function typedAction<T extends string>(type: T): { type: T };
export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P
): { type: T; payload: P };

export function typedAction(type: string, payload?: any): TypedActionReturnType {
  return { type, payload };
}
