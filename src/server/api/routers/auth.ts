import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const authRouter = createTRPCRouter({
	getSession: protectedProcedure.query(({ ctx }) => {
		return ctx.session
	}),
	getUser: protectedProcedure.query(({ ctx }) => {
		return ctx.session.user;
	})
});
