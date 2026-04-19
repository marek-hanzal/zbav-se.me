export namespace TaggedError {
	export interface Props {
		message: string;
		tag: string;
	}
}

export class TaggedError extends Error {
	public readonly _tag: string;

	constructor({ message, tag }: TaggedError.Props) {
		super(message);
		this._tag = tag;
	}

	toJSON() {
		return {
			message: this.message,
			tag: this._tag,
		};
	}
}
