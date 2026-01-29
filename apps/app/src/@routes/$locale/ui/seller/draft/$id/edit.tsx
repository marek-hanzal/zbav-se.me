import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { Setup } from "~/app/@seller-user/draft/Setup";

export const Route = createFileRoute("/$locale/ui/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();
		const locale = useLocale();
		const navigate = Route.useNavigate();

		return (
			<withDraftFetchQuery.Suspense
				data={{
					where: {
						id,
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => (
					<Setup
						draft={data}
						onListing={async () => {
							await navigate({
								to: "/$locale/ui/seller/listing/my",
								params: {
									locale,
								},
							});
						}}
						onDelete={async () => {
							await navigate({
								to: "/$locale/ui/seller",
								params: {
									locale,
								},
							});
						}}
					/>
				)}
			</withDraftFetchQuery.Suspense>
		);
	},
});
