import type { FC } from "react";
import { uiButton } from "@/lib/client/button";
import { CheckIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

export namespace AckButton {
	type LinkProps = Pick<LinkTo.Props, "iconPosition" | "iconProps">;

	export interface Props extends uiButton.Component<LinkProps> {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckButton: FC<AckButton.Props> = ({
	close,
	transaction,
	iconPosition,
	iconProps,
	className,
	...ui
}) => {
	const locale = useLocale();

	return (
		<LinkTo
			to={"/$locale/app/buyer/transaction/list"}
			params={{
				locale,
			}}
			{...uiButton({
				name: "AckButton",
				className,
				...ui,
			})}
			data-action={"acknowledge transaction"}
			title={translator.text("Acknowledge transaction (aria)")}
			icon={CheckIcon}
			iconPosition={iconPosition}
			iconProps={iconProps}
			onClick={close}
		>
			<Tx label="Acknowledge transaction (button)" />
		</LinkTo>
	);
};
