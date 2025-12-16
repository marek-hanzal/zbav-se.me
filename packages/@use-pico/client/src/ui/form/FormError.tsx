import { type FC, type ReactNode, useId } from "react";
import { Badge } from "../badge/Badge";
import { Tx } from "../tx/Tx";

export namespace FormError {
	export type Type =
		| {
				message: string;
		  }
		| {
				component: ReactNode;
		  }
		| undefined;

	export interface Meta {
		isDirty: boolean;
		isTouched: boolean;
		errors: Type[] | undefined;
	}

	export interface Props {
		meta: Meta;
	}
}

export const FormError: FC<FormError.Props> = ({ meta }) => {
	const errorId = useId();
	const [error] = meta.errors ?? [];
	const isError = meta.isTouched && meta.errors && meta.errors.length > 0;

	if (!isError || !error) {
		return null;
	}

	if ("component" in error) {
		return (
			<Badge
				key={errorId}
				ui={{
					tone: "danger",
					theme: "light",
					size: "xs",
				}}
			>
				{error.component}
			</Badge>
		);
	}

	if ("message" in error) {
		return (
			<Badge
				key={errorId}
				ui={{
					tone: "danger",
					theme: "light",
					size: "xs",
				}}
			>
				<Tx label={error.message} />
			</Badge>
		);
	}

	return null;
};
