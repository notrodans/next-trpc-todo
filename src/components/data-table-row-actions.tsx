"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/ui/dropdown-menu";

import { type Task } from "@/data/schema";
import { taskSchemaWithoutId, taskSchema } from "../data/schema";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { labels, statuses, priorities } from "@/data/data";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose
} from "@/ui/dialog";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from "@/ui/select";
import { Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { useForm } from "react-hook-form";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from "@/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row
}: DataTableRowActionsProps<TData>) {
	const task = taskSchema.parse(row.original);
	const { toast } = useToast();

	const form = useForm<Task>({
		resolver: zodResolver(taskSchemaWithoutId),
		defaultValues: {
			label: task.label,
			status: task.status,
			priority: task.priority,
			title: task.title
		}
	});

	const utils = api.useUtils();

	const deleteTask = api.task.delete.useMutation({
		onSuccess: async () => {
			await utils.task.getAll.invalidate();
			toast({
				title: "Success",
				description: "Deleted task"
			});
		},
		onError: error => {
			toast({
				title: "Failed to delete task",
				description: error.message
			});
		}
	});

	const updateTask = api.task.update.useMutation({
		onSuccess: async () => {
			await utils.task.getAll.invalidate();
			toast({
				title: "Success",
				description: "Updated task"
			});
		},
		onError: error => {
			toast({
				title: "Failed to update task",
				description: error.message
			});
		}
	});

	async function onSubmit(values: Task) {
		await updateTask.mutateAsync({
			...values,
			id: task.id
		});
	}

	async function onDelete() {
		await deleteTask.mutateAsync({ id: task.id });
	}

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
					>
						<DotsHorizontalIcon className='h-4 w-4' />
						<span className='sr-only'>Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-[160px]'>
					<DialogTrigger asChild>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</DialogTrigger>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onDelete}>
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit</DialogTitle>
					<DialogDescription>
						Enter the details of the updated task
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem className='[&:not(:last-child)]:mb-5'>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Some title' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => {
								return (
									<FormItem className='[&:not(:last-child)]:mb-5'>
										<FormLabel>Label</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder={field.value} />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{labels.map(label => (
													<SelectItem key={label.label} value={label.value}>
														{label.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name='status'
							render={({ field }) => (
								<FormItem className='[&:not(:last-child)]:mb-5'>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder={field.value} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{statuses.map(status => (
												<SelectItem key={status.label} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='priority'
							render={({ field }) => (
								<FormItem className='[&:not(:last-child)]:mb-5'>
									<FormLabel>Priority</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder={field.value} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{priorities.map(status => (
												<SelectItem key={status.label} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type='submit' disabled={updateTask.isLoading}>
									{updateTask.isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
