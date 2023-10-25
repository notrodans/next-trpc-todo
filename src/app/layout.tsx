import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/ui/toaster";
import { type Metadata } from "next";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
	title: "Tasks",
	description: "A task and issue tracker build using Tanstack Table."
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={cn(`font-sans antialiased ${inter.variable} dark`)}>
				<TRPCReactProvider headers={headers()}>
					<div className='wrapper flex min-h-screen flex-col overflow-hidden'>
						<main className='flex flex-auto flex-col'>{children}</main>
					</div>
					<Toaster />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
