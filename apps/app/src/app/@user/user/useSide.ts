import { useUser } from "~/app/@user/user/useUser";

export const useSide = () => {
	return useUser().side;
};
