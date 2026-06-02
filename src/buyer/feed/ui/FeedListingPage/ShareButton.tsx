import { useRouter } from "@tanstack/react-router";
import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { useCopy } from "@/lib/client/clipboard";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { CheckIcon } from "~/common/ui/icon";

export namespace ShareButton {
	export interface Props {
		listingId: string;
	}
}

export const ShareButton: FC<ShareButton.Props> = ({ listingId }) => {
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
		>
			{translator.text("Share listing (label)")}
		</Button>
	);
};
