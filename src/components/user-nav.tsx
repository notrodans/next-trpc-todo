import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { type Session } from "next-auth";
import Link from "next/link";

export function UserNav({ session }: { session: Session }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
					<Avatar className='h-9 w-9'>
						<AvatarImage
							src={session?.user?.image ?? ""}
							alt={session?.user?.name ?? ""}
						/>
						<AvatarFallback>{session?.user?.name}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{session?.user?.name}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{session?.user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href='/api/auth/signout'>Log out</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
