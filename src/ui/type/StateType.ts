export namespace StateType {
	/**
	 * State type is a simple wrapper around a value and a setter function.
	 */
	export interface State<in out TValue> {
		value: TValue;
		setFn(value: TValue | ((prev: TValue) => TValue)): void;
	}

	export interface Simple<in out TValue> {
		value: TValue;
		setFn(value: TValue): void;
	}
}
