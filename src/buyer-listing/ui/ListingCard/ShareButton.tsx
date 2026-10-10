import { useRouter } from "@tanstack/react-router";
import { type FC, useState } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { useCopy } from "~/clipboard/hook/useCopy";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Button } from "~/ui/ui/Button";

export namespace ShareButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

export const ShareButton: FC<ShareButton.Props> = ({ listingId, ...props }) => {
	const router = useRouter();
	const locale = useLocale();
	const translator = useTranslator();
	const [success, setSuccess] = useState(false);

	const copy = useCopy({
		onSuccess() {
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 1500);
		},
	});

	return (
		<Button
			data-ui={"ShareButton[Button]"}
			iconEnabled={success ? CheckIcon : "icon-[solar--screen-share-linear]"}
			iconProps={{
				"data-ui-text": "xl",
			}}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-size="default"
			data-ui-shadow={false}
			data-ui-border={undefined}
			data-ui-width="full"
			loading={copy.isPending}
			disabled={copy.isPending}
			onClick={() => {
				const location = router.buildLocation({
					to: "/$locale/z/$id/view",
					params: {
						id: listingId,
						locale,
					},
				}).href;

				copy.mutate({
					text: new URL(location, import.meta.env.VITE_ORIGIN).toString(),
				});
			}}
			{...props}
		>
			{translator.text("Share listing (label)")}
		</Button>
	);
};
