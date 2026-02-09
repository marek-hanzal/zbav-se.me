import { DatabaseError } from "pg";
import { ConflictErrorFx } from "~/error/ConflictErrorFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

export namespace mapToError {
	export interface Props {
		conflict?: string;
	}
}

export const mapToError = (props: mapToError.Props) => {
	return (error: unknown) => {
		if (error instanceof DatabaseError) {
			switch (error.code) {
				case "23505":
					return new ConflictErrorFx({
						message: props.conflict ?? "(unknown conflict)",
						cause: error,
					});
			}

			return new RuntimeErrorFx({
				message: error.message,
				cause: error,
			});
		} else if (error instanceof Error) {
			return new RuntimeErrorFx({
				message: error.message,
				cause: error,
			});
		}

		return new RuntimeErrorFx({
			message: String(error),
			cause: error,
		});
	};
};
