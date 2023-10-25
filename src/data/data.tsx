import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	CrossCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon
} from "@radix-ui/react-icons";

export const labels = [
	{
		value: "Bug",
		label: "Bug"
	},
	{
		value: "Feature",
		label: "Feature"
	},
	{
		value: "Documentation",
		label: "Documentation"
	}
];

export const statuses = [
	{
		value: "Backlog",
		label: "Backlog",
		icon: QuestionMarkCircledIcon
	},
	{
		value: "Todo",
		label: "Todo",
		icon: CircleIcon
	},
	{
		value: "InProgress",
		label: "In Progress",
		icon: StopwatchIcon
	},
	{
		value: "Done",
		label: "Done",
		icon: CheckCircledIcon
	},
	{
		value: "Canceled",
		label: "Canceled",
		icon: CrossCircledIcon
	}
];

export const priorities = [
	{
		label: "Low",
		value: "Low",
		icon: ArrowDownIcon
	},
	{
		label: "Medium",
		value: "Medium",
		icon: ArrowRightIcon
	},
	{
		label: "High",
		value: "High",
		icon: ArrowUpIcon
	}
];
