import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Task, taskSchema, taskSchemaCreate } from "@/data/schema";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
	create: protectedProcedure
		.input(taskSchemaCreate)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.task.create({
				data: {
					title: input.title,
					status: input.status,
					priority: input.priority,
					label: input.label,
					createdBy: { connect: { id: ctx.session.user.id } }
				}
			});
		}),
	update: protectedProcedure
		.input(taskSchema)
		.output(taskSchema)
		.mutation(async ({ ctx, input }) => {
			const data = {
				id: input.id
			} as Task satisfies Task;

			input.title && (data.title = input.title);
			input.status && (data.status = input.status);
			input.priority && (data.priority = input.priority);
			input.label && (data.label = input.label);

			return await ctx.db.task.update({
				where: { id: input.id },
				data
			});
		}),
	getAll: protectedProcedure
		.output(z.array(taskSchema))
		.query(async ({ ctx }) => {
			return await ctx.db.task.findMany({
				where: { createdById: ctx.session.user.id },
				select: {
					label: true,
					priority: true,
					status: true,
					title: true,
					id: true
				}
			});
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.output(z.boolean())
		.mutation(async ({ ctx, input }) => {
			return !!(await ctx.db.task.delete({
				where: { id: input.id, createdById: ctx.session.user.id }
			}));
		}),
	deleteMany: protectedProcedure
		.input(z.array(taskSchema.pick({ id: true }).transform(input => input.id)))
		.output(z.boolean())
		.mutation(async ({ ctx, input }) => {
			return !!(await ctx.db.task.deleteMany({
				where: { createdById: ctx.session.user.id, id: { in: input } }
			}));
		})
});
