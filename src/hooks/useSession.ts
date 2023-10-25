import { api } from "@/trpc/react";
import { type Session } from "next-auth";
import { redirect } from "next/navigation";

export const useSession = () => {
	const { data: session, isLoading: isSessionLoading } = api.auth.getSession.useQuery();

	if (!isSessionLoading && !session) {
		redirect("/api/auth/signin");
	}

	return {
		session: session! satisfies Session,
		isSessionLoading
	}
}
