import { createFileRoute } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Setup } from "~/app/draft/Setup";

export const Route = createFileRoute("/$locale/ui/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();

		return (
			<TitleContainer textTitle={"Draft edit (title)"}>
				<withDraftFetchQuery.Suspense
					data={{
						where: {
							id,
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => <Setup draft={data} />}
				</withDraftFetchQuery.Suspense>
			</TitleContainer>
		);
	},
});
