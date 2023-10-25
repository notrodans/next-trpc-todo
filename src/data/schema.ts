import { z } from "zod";

export const taskSchemaCreate = z.object({
	title: z.string().min(6),
	label: z.enum(["Bug", "Feature", "Documentation"]),
	status: z.enum(["Backlog", "Todo", "InProgress", "Done", "Canceled"]),
	priority: z.enum(["High", "Medium", "Low"])
})

export const taskSchema = z.object({
	id: z.string(),
	title: z.string(),
	label: z.enum(["Bug", "Feature", "Documentation"]),
	status: z.enum(["Backlog", "Todo", "InProgress", "Done", "Canceled"]),
	priority: z.enum(["High", "Medium", "Low"])
});

export const taskSchemaWithoutId = taskSchema.omit({ id: true });
export type Task = z.infer<typeof taskSchema>;
export type TaskWithoutId = z.infer<typeof taskSchemaWithoutId>;
