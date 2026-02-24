import type { MarkSuspense } from "@use-pico/client/type";
import { withUploadFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		uploadId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	uploadId,
}) => {
	const { data } = withUploadFetchQuery.useSuspenseQuery({
		where: {
			id: uploadId,
		},
	});

	return (
		<HeroImage
			src={data.url}
			alt={data.id}
			visible
			ui={{
				round: "default",
			}}
		/>
	);
};
