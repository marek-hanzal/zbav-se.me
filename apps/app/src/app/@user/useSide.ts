import { useUser } from "~/app/@user/useUser";

export const useSide = () => {
	return useUser().side;
};
