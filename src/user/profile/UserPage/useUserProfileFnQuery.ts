import { useSuspenseQuery } from "@tanstack/react-query";
import { UserProfileFn } from "./UserProfileFn";

export const useUserProfileFnQuery = () => {
	const { data } = useSuspenseQuery({
		structuralSharing: false,
		queryKey: [
			"user",
			"profile",
		],
		queryFn: UserProfileFn,
	});

	return data;
};
