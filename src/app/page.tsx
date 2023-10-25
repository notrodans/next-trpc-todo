"use client";

import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { UserNav } from "@/components/user-nav";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function TaskPage() {
	const { session } = useSession();

	const { data: tasks, isLoading } = api.task.getAll.useQuery();

	if (isLoading) {
		return <Loader2 className='m-auto animate-spin' />;
	}

	return (
			<div className='h-full flex-1 flex-col space-y-8 p-8 md:flex'>
				<div className='flex items-center justify-between space-y-2'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
						<p className='text-muted-foreground'>
							Here&apos;s a list of your tasks for this month!
						</p>
					</div>
					<div className='flex items-center space-x-2'>
						<UserNav session={session} />
					</div>
				</div>
				<DataTable data={tasks ?? []} columns={columns} />
			</div>
	);
}
