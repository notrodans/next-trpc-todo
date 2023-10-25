"use client";

import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

import { labels, priorities, statuses } from "@/data/data";
import {
	type Task,
	taskSchemaWithoutId,
	type TaskWithoutId,
	taskSchemaCreate
} from "@/data/schema";
import { api } from "@/trpc/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger
} from "@/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { DialogFooter, DialogHeader } from "@/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/ui/form";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem
} from "@/ui/dropdown-menu";
import { useToast } from "./ui/use-toast";

interface DataTableToolbarProps {
	table: Table<Task>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const { toast } = useToast();

	const selectedRowsLength = table.getSelectedRowModel().rows.length;

	const form = useForm<TaskWithoutId>({
		resolver: zodResolver(taskSchemaCreate),
		defaultValues: {
			label: "Bug",
			status: "Backlog",
			priority: "Low",
			title: ""
		}
	});

	const utils = api.useUtils();

	const createTask = api.task.create.useMutation({
		onSuccess: async () => {
			await utils.task.invalidate();
			toast({
				title: "Success",
				description: "Created task"
			});
		},
		onError: error => {
			toast({ title: "Failed to create task", description: error.message });
		}
	});

	const deleteManyTask = api.task.deleteMany.useMutation({
		onSuccess: async () => {
			await utils.task.getAll.invalidate();
			toast({
				title: "Success",
				description: `Deleted: ${selectedRowsLength} tasks`
			});
		},
		onError: error => {
			toast({ title: "Failed to create task", description: error.message });
		}
	});

	async function onDeleteMany() {
		if (!selectedRowsLength) {
			return;
		}

		await deleteManyTask.mutateAsync([
			...table
				.getFilteredSelectedRowModel()
				.rows.map(row => ({ id: row.original.id }))
		]);
		table.resetRowSelection();
	}

	async function onSubmit(values: TaskWithoutId) {
		await createTask.mutateAsync({ ...values });
	}

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				<Input
					placeholder='Filter tasks...'
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("title")?.setFilterValue(event.target.value)
					}
					className='h-8 w-[150px] lg:w-[250px]'
				/>
				<Dialog
					onOpenChange={open => {
						if (!open) {
							form.reset();
						}
					}}
				>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Create task</DialogTitle>
							<DialogDescription>
								Enter the details of the task you want to create
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
									<Button type='submit' disabled={createTask.isLoading}>
										{createTask.isLoading && (
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										)}
										Create task
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
					<div className='flex flex-wrap'>
						<DialogTrigger asChild>
							<Button
								variant='default'
								size='sm'
								className='inline-flex h-8 items-center gap-1'
							>
								Add
							</Button>
						</DialogTrigger>
						{table.getColumn("status") && (
							<DataTableFacetedFilter
								column={table.getColumn("status")}
								title='Status'
								options={statuses}
							/>
						)}
						{table.getColumn("priority") && (
							<DataTableFacetedFilter
								column={table.getColumn("priority")}
								title='Priority'
								options={priorities}
							/>
						)}
						{isFiltered && (
							<Button
								variant='ghost'
								onClick={() => table.resetColumnFilters()}
								className='h-8 px-2 lg:px-3'
							>
								Reset
								<Cross2Icon className='ml-2 h-4 w-4' />
							</Button>
						)}
						{selectedRowsLength >= 1 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='sm' className='h-8'>
										Actions
										<MixerHorizontalIcon className='ml-2 h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem onClick={onDeleteMany}>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</Dialog>
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
