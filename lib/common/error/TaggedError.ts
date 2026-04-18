export namespace TaggedError {
	export interface Props {
		message: string;
		name: string;
		tag: string;
	}
}

export class TaggedError extends Error {
	public readonly _tag: string;

	constructor({ message, name, tag }: TaggedError.Props) {
		super(message);
		this.name = name;
		this._tag = tag;
	}

	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
		};
	}
}
