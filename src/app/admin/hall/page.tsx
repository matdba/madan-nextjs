"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
	AddSquare,
	AltArrowLeft,
	ArrowDown,
	ArrowUp,
	Bus,
	BoxMinimalistic,
	CloseCircle,
	Filter,
	Magnifer,
	MagniferZoomIn,
	MapPoint,
	SortVertical,

} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import toast from "react-hot-toast";

import { CityListType } from "@/lib/schemas/city-list.schema";
import { TruckListType } from "@/lib/schemas/truck-list.schema";
import Pagination from "@/components/widgets/Pagination";
import TableShimmer from "@/components/shimmers/TableShimmer";
import { CargosType } from "@/lib/schemas/cargos.schema";


export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "title", name: "عنوان", percent: 20, textRight: false, sortable: false },
	{ id: "loading", name: "مبدا", percent: 20, textRight: false, sortable: false },
	{ id: "discharging", name: "مقصد", percent: 20, textRight: false, sortable: false },
	{ id: "truck", name: "ناوگان", percent: 15, textRight: false, sortable: false },
	{ id: "weight", name: "تناژ", percent: 15, textRight: false, sortable: false },
	{ id: "price", name: "قیمت", percent: 15, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 5, textRight: false, sortable: false },
];


export default function AdminUsers() {
	const [cargosData, setCargosData] = useState<CargosType | null>(null);
	const [citiesData, setCitiesData] = useState<CityListType | null>(null);
	const [trucksData, setTrucksData] = useState<TruckListType | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
	const [tempSearchTerm, setTempSearchTerm] = useState(searchParams.get("search") || "");

	const currentSortBy = searchParams.get("sort_by") || "";
	const currentSortDir = searchParams.get("dir") || "";
	const filteredLoadingCityId = Number(searchParams.get("loading_city_id") ?? 0);
	const filteredDischargingCityId = Number(searchParams.get("discharging_city_id") ?? 0);
	const filteredTruckId = Number(searchParams.get("truck_id") ?? 0);

	const [loading, setLoading] = useState<boolean>(true);

	const fetchDrivers = useCallback(async () => {
		try {
			setLoading(true);
			const cargosResponse = await fetch(`/api/cargos?${searchParams}`);
			const citiesResponse = await fetch("/api/city-list");
			const trucksResponse = await fetch("/api/truck-list");

			if (!cargosResponse.ok || !citiesResponse.ok || !trucksResponse.ok) {
				toast.error('خطا در دریافت اطلاعات');
				return;
			}

			const cargosResult = await cargosResponse.json();
			const citiesResult = await citiesResponse.json();
			const trucksResult = await trucksResponse.json();

			console.log(cargosResult);

			setCargosData(cargosResult);
			setCitiesData(citiesResult);
			setTrucksData(trucksResult);

		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			toast.error("خطا در دریافت اطلاعات داشبورد");
		} finally {
			setLoading(false);
		}
	}, [searchParams]);


	useEffect(() => {
		fetchDrivers();
	}, [searchParams, fetchDrivers]);


	useEffect(() => {
		setSearchTerm(searchParams.get("search") || "");
		setTempSearchTerm(searchParams.get("search") || "");
	}, [searchParams]);


	const updateFilters = (search: string, loading_city_id: number, discharging_city_id: number, truck_id: number) => {
		const params = new URLSearchParams();

		// بازگشت به صفحه اول هنگام اعمال فیلتر
		params.delete("page");

		if (search && search.trim()) {
			params.set("search", search.trim());
		}

		if (loading_city_id) {
			params.set("loading_city_id", loading_city_id.toString());
		}

		if (discharging_city_id) {
			params.set("discharging_city_id", discharging_city_id.toString());
		}

		if (truck_id) {
			params.set("truck_id", truck_id.toString());
		}

		if (currentSortBy) {
			params.set("sort_by", currentSortBy);
			params.set("dir", currentSortDir);
		}

		router.push(`?${params.toString()}`, { scroll: false });
	};


	const updateSorting = (sortBy: string, sortDirection: string) => {
		const params = new URLSearchParams(searchParams.toString());

		params.delete("page"); // Reset to first page when sorting

		if (sortBy && sortDirection) {
			params.set("sort_by", sortBy);
			params.set("dir", sortDirection);
		} else {
			params.delete("sort_by");
			params.delete("dir");
		}

		router.push(`?${params.toString()}`, { scroll: false });
	};

	const handleSearchInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
		setTempSearchTerm(e.target.value);
	};

	const handleSearchSubmit = () => {
		setSearchTerm(tempSearchTerm);
		updateFilters(tempSearchTerm, filteredLoadingCityId, filteredDischargingCityId, filteredTruckId);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setTempSearchTerm("");
		router.push("/hall", { scroll: false });
	};

	const hasActiveFilters = searchTerm || (filteredLoadingCityId !== 0) || (filteredDischargingCityId !== 0) || (filteredTruckId !== 0);
	const hasActiveSorting = currentSortBy && currentSortDir;

	const requestSort = (key: string) => {
		if (!columnHeads.find((col) => col.id === key)?.sortable) return;

		let direction = "asc";

		if (currentSortBy === key) {
			if (currentSortDir === "asc") {
				direction = "desc";
			} else if (currentSortDir === "desc") {
				updateSorting("", "");
				return;
			}
		}

		updateSorting(key, direction);
	};

	const getSortIcon = (columnId: string) => {
		if (!columnHeads.find((col) => col.id === columnId)?.sortable) {
			return null;
		}

		if (currentSortBy === columnId) {
			return currentSortDir === "asc" ? (
				<ArrowUp size={14} className="text-primary" />
			) : (
				<ArrowDown size={14} className="text-primary" />
			);
		}

		return <SortVertical size={18} className="text-gray-500" />;
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());

		if (newPage === 1) {
			params.delete("page");
		} else {
			params.set("page", newPage.toString());
		}
		router.push(`?${params.toString()}`, { scroll: false });
	};


	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	return (
		<>
			<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
				{/* Filters Section */}
				<div className="p-6">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
						{/* Search Bar */}
						<div className="lg:col-span-3">
							<div className="relative flex-1">
								<button
									onClick={handleSearchSubmit}
									className="absolute flex items-center justify-center h-10 w-10 p-2.5 inset-y-0
										left-1 top-0.5 bg-tertiary/30 rounded-full z-10 hover:text-primary cursor-pointer"
								>
									<Magnifer size={24} />
								</button>
								<input
									type="text"
									placeholder="جستجو بر اساس نام ..."
									value={tempSearchTerm}
									onChange={handleSearchInputChange}
									onKeyDown={(e) => e.key === "Enter" ? handleSearchSubmit() : null}
									className="block w-full pr-2 py-3 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark
                      						rounded-full focus:border-primary text-sm placeholder:text-xs"
									style={{ paddingLeft: "50px" }}

								/>
							</div>
						</div>

						{/* Clear Filters Button */}
						<div className="lg:col-span-1" />


						<div className="lg:col-span-2">
							<CustomDropdown
								value={filteredLoadingCityId}
								// defaultOption={filteredCityId === 0 ? { value: 0, label: 'همه' } as CustomOption : undefined}
								onChange={(value) => {
									if (value !== filteredLoadingCityId)
										updateFilters(
											tempSearchTerm,
											parseInt(value.toString()),
											parseInt(filteredDischargingCityId.toString()),
											parseInt(filteredTruckId.toString())
										);
								}}
								placeholder="فیلتر مبدا"
								icon={<MapPoint />}
								options={citiesData !== null
									? [
										{ value: 0, label: "همه" },
										...citiesData.data.map((city) => ({
											value: city.id,
											label: city.name,
										})),
									]
									: []}
							/>
						</div>

						<div className="lg:col-span-2">
							<CustomDropdown
								value={filteredDischargingCityId}
								// defaultOption={filteredCityId === 0 ? { value: 0, label: 'همه' } as CustomOption : undefined}
								onChange={(value) => {
									if (value !== filteredDischargingCityId)
										updateFilters(
											tempSearchTerm,
											parseInt(filteredLoadingCityId.toString()),
											parseInt(value.toString()),
											parseInt(filteredTruckId.toString())
										);
								}}
								placeholder="فیلتر مبدا"
								icon={<MapPoint />}
								options={citiesData !== null
									? [
										{ value: 0, label: "همه" },
										...citiesData.data.map((city) => ({
											value: city.id,
											label: city.name,
										})),
									]
									: []}
							/>
						</div>

						<div className="lg:col-span-2">
							<CustomDropdown
								value={filteredTruckId}
								// defaultOption={filteredCityId === 0 ? { value: 0, label: 'همه' } as CustomOption : undefined}
								onChange={(value) => {
									if (value !== filteredTruckId)
										updateFilters(
											tempSearchTerm,
											parseInt(filteredLoadingCityId.toString()),
											parseInt(filteredDischargingCityId.toString()),
											parseInt(value.toString())
										);
								}}
								placeholder="فیلتر ناوگان"
								icon={<Bus />}
								options={trucksData !== null
									? [
										{ value: 0, label: "همه" },
										...trucksData.data.map((city) => ({
											value: city.id,
											label: city.name,
										})),
									]
									: []}
							/>
						</div>

						<div className="lg:col-span-2 flex justify-end">
							<CustomButton
								onClick={() => router.push("/hall/new")}
								title="ثبت بار"
								icon={<AddSquare size={18} />}
							/>
						</div>
					</div>

					{/* Active Filters Summary */}
					{(hasActiveFilters || hasActiveSorting) && (
						<div className="mt-4 pt-4 border-t border-gray-light dark:border-gray-dark">
							<div className="flex flex-wrap gap-2 items-center">
								<Filter className="h-4 w-4 text-gray-500" />
								<span className="font-medium">فیلترهای فعال:</span>
								{searchTerm && (
									<span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
										جستجو: {searchTerm}
									</span>
								)}
								{(filteredLoadingCityId !== 0) && (
									<span className="inline-flex items-center px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
										مبدا: {citiesData!.data.find((opt) => opt.id === filteredLoadingCityId)?.name}
									</span>
								)}
								{(filteredDischargingCityId !== 0) && (
									<span className="inline-flex items-center px-2.5 py-1 bg-red-400/10 text-red-400 rounded-full text-xs font-medium">
										مقصد: {citiesData!.data.find((opt) => opt.id === filteredDischargingCityId)?.name}
									</span>
								)}
								{(filteredTruckId !== 0) && (
									<span className="inline-flex items-center px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
										ناوگان: {trucksData!.data.find((opt) => opt.id === filteredTruckId)?.name}
									</span>
								)}
								{hasActiveSorting && (
									<span className="inline-flex items-center px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
										مرتب‌سازی: {columnHeads.find((col) => col.id === currentSortBy)?.name}(
										{currentSortDir === "asc" ? "صعودی" : "نزولی"})
									</span>
								)}
								<div className="lg:col-span-1">
									{(hasActiveFilters || hasActiveSorting) && (
										<CustomButton
											onClick={clearFilters}
											title="حذف فیلترها"
											background="bg-red-400"
											lowHeight={true}
											icon={<CloseCircle size={18} />}
										/>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Table */}
				<div className="overflow-x-auto px-4">
					<table className="min-w-full rounded-full">
						<thead className="bg-background-light dark:bg-background-dark rounded-full text-gray-500">
							<tr>
								{columnHeads.map((head, index) => (
									<th
										key={head.id}
										scope="col"
										className={`px-6 py-4 w-[${head.percent}%]
											text-xs font-semibold uppercase tracking-wider hover:rounded-full
											${head.sortable ? "cursor-pointer hover:bg-secondary/20" : ""}
											${index === 0 ? "rounded-r-full" : ""}
											${index === columnHeads.length - 1 ? "rounded-l-full" : ""}
										`}
										onClick={() => head.sortable && requestSort(head.id)}
									>
										<div className={`flex items-center gap-2 ${head.textRight ? "justify-start" : "justify-center"}`}>
											{head.name}
											{getSortIcon(head.id)}
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-light dark:divide-gray-dark">
							{cargosData && cargosData.data.cargos.length > 0 ? (
								cargosData.data.cargos.map((cargo) => {
									return (
										<tr
											className={`hover:bg-secondary/20 hover:rounded-full cursor-pointer transition-colors group`}
											key={cargo.id}
											onClick={() => {
												useBreadcrumbStore.getState().setName(cargo.title);
												router.push(`/hall/${cargo.id}`)
											}}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
														<span className="text-sm font-medium text-primary">{cargo.title.charAt(0)}</span>
													</div>
													<div>
														<div className="text-sm font-medium">{cargo.title}</div>
														{/* <div className="text-xs text-gray-500">{cargo.user.mobile_number}</div> */}
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<div className="">
													<div className="bg-green-100 rounded-full text-green-400">{cargo.loading_city.name}</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<div className="bg-red-50 rounded-full text-red-400">{cargo.discharging_city.name}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<div>{cargo.truck.name}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<div>{cargo.free_weight ? 'تناژ آزاد' : cargo.weight + ' تن'}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<div>{cargo.cost !== 0 ? cargo.cost.toLocaleString() + ' تومان' : cargo.cost_per}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<AltArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={columnHeads.length} className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center">
											<div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
												{hasActiveFilters ? (
													<MagniferZoomIn className="w-8 h-8 text-gray-400 dark:text-gray-500" />
												) : (
													<BoxMinimalistic className="w-8 h-8 text-gray-400 dark:text-gray-500" />
												)}
											</div>
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
												{hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ باری یافت نشد"}
											</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												{hasActiveFilters ? "لطفاً فیلترهای خود را تغییر دهید" : "هنوز باری در سالن اعلام بار ثبت نشده است"}
											</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{!loading &&
					<Pagination
						pageCount={cargosData!.data.pagination.last_page_number}
						currentPage={cargosData!.data.pagination.current_page_number}
						currentItemCount={cargosData!.data.pagination.current_count}
						handlePageChange={handlePageChange}
					/>
				}

			</section >
		</>
	);
}
