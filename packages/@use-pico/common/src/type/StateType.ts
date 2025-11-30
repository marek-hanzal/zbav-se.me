/**
 * State type is a simple wrapper around a value and a setter function.
 */
export interface StateType<TValue> {
	value: TValue;
	set(value: TValue | ((prev: TValue) => TValue)): void;
}
