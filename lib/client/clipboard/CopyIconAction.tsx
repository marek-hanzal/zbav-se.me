import { type FC, useState } from "react";
import { CheckIcon } from "../icon/CheckIcon";
import { CopyIcon } from "../icon/CopyIcon";
import { Icon } from "../icon/Icon";
import { SpinnerIcon } from "../icon/SpinnerIcon";
import { useCopy } from "./useCopy";

export namespace CopyIconAction {
	export interface Props extends Icon.PropsEx {
		text: string;
	}
}

export const CopyIconAction: FC<CopyIconAction.Props> = ({ text, ...props }) => {
	const [success, setSuccess] = useState(false);

	const copy = useCopy({
		onSuccess() {
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 1500);
		},
	});

	if (copy.isPending) {
		return (
			<Icon
				icon={SpinnerIcon}
				data-ui-tone={"brand"}
				data-ui-theme={"light"}
				data-ui-color={"lead"}
				data-ui-text={"xl"}
				{...props}
			/>
		);
	}

	if (success) {
		return (
			<Icon
				icon={CheckIcon}
				data-ui-tone={"link"}
				data-ui-theme={"light"}
				data-ui-color={"lead"}
				data-ui-text={"xl"}
				{...props}
			/>
		);
	}

	return (
		<Icon
			icon={CopyIcon}
			data-ui-text={"xl"}
			onClick={() => {
				copy.mutateAsync({
					text,
				});
			}}
			{...props}
		/>
	);
};
