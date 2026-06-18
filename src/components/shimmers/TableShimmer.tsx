"use client";

import { ColumnHeadProps } from "@/app/admin/users/page";
import { Magnifer } from "@solar-icons/react";

type TableShimmerProps = {
	columnHeads: Array<ColumnHeadProps>;
}


const TableShimmer = ({ columnHeads }: TableShimmerProps) => {
	return (
		<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">

			<div className="p-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

					<div className="lg:col-span-4">
						<div className="relative flex-1">
							<div className="block w-full pr-2 py-2.5 bg-gray-100 dark:bg-background-dark
								border border-gray-300 dark:border-gray-dark rounded-full animate-pulse">
								<Magnifer size={24} className="text-transparent" />
							</div>
						</div>
					</div>

					<div className="lg:col-span-8 flex justify-end">
						<div
							className="min-w-40 px-4 rounded-full flex items-center justify-self-center justify-center
								gap-2 shadow-xs bg-primary"
						>
							<div className="w-6 h-6 bg-card-light/50 dark:bg-card-dark/50 rounded-full animate-pulse" />
							<div className="w-20 h-6 bg-card-light/50 dark:bg-card-dark/50 rounded-full animate-pulse" />
						</div>
					</div>

				</div>
			</div>

			<div className="overflow-x-auto px-4">
				<table className="min-w-full rounded-full">

					<thead className="bg-background-light dark:bg-background-dark rounded-full">
						<tr>
							{columnHeads.map((head, index) => (
								<th key={head.id}
									scope="col"
									className={`px-6 py-4 w-[${head.percent}%] tracking-wider
										${index === 0 ? "rounded-r-full" : ""}
										${index === columnHeads.length - 1 ? "rounded-l-full" : ""}
								`}>
									<div className={`flex items-center gap-2 ${head.textRight ? "justify-start" : "justify-center"}`}>
										{head.name && (
											<>
												<div className="w-16 h-4.5 bg-gray-400 rounded-full animate-pulse" />
												<div className="w-4.5 h-4.5 bg-gray-400 rounded-full animate-pulse" />
											</>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-light dark:divide-gray-dark">
						{[...Array(8)].map((_, index) => (
							<tr key={index} className="">
								<td className="px-6 py-4.5 whitespace-nowrap">
									<div className="flex items-center">
										<div className="w-10 h-8 bg-gray-400 rounded-full ml-3 animate-pulse"></div>
										<div className="w-full">
											<div className="h-4 bg-gray-400 rounded-full w-full mb-1 animate-pulse"></div>
											<div className="h-3 bg-gray-400 rounded-full w-20 animate-pulse"></div>
										</div>
									</div>
								</td>

								{[...Array(columnHeads.length - 1)].map((head, index) => (
									<td className="px-6 py-4 whitespace-nowrap text-center" key={index}>
										<div className="h-6 bg-gray-400 rounded-full w-full mx-auto animate-pulse"></div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Shimmer */}
			<div className="px-6 py-4 border-t border-gray-light dark:border-gray-dark">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-1">
						<div className="h-4 bg-gray-400 rounded-full w-12 animate-pulse"></div>
						<div className="h-4 bg-gray-600 rounded-full w-4 animate-pulse"></div>
						<div className="h-4 bg-gray-400 rounded-full w-4 animate-pulse"></div>
						<div className="h-4 bg-gray-600 rounded-full w-4 animate-pulse"></div>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
						<div className="w-10 h-10 bg-primary rounded-full animate-pulse"></div>
						<div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
						<div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
						<div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TableShimmer;
