"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	AddSquare,
	CloseCircle,
	Key,
	MagniferZoomIn,
	PenNewRound,
	ShieldKeyhole,
	TextField,
	TrashBinMinimalistic,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import toast from "react-hot-toast";

import { PermissionItemType, PermissionListResponse } from "@/lib/schemas/permission-list.schema";
import TableShimmer from "@/components/shimmers/TableShimmer";


export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام دسترسی", percent: 35, textRight: false, sortable: false },
	{ id: "key", name: "کلید دسترسی", percent: 40, textRight: false, sortable: false },
	{ id: "permissionId", name: "شناسه", percent: 15, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type PermissionForm = {
	PermissionID: number;
	PermissionKey: string;
	PermissionName: string;
};


export default function AdminPermissions() {
	const [permissionListData, setPermissionListData] = useState<PermissionListResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const [searchTerm, setSearchTerm] = useState("");

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<PermissionForm>({
		PermissionID: 0,
		PermissionKey: "",
		PermissionName: "",
	});

	const [deleteTarget, setDeleteTarget] = useState<PermissionItemType | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState({
		PermissionKey: "",
		PermissionName: "",
	});

	const fetchPermissions = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/permissions");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setPermissionListData(result);
		} catch (error) {
			console.error("Error fetching permissions data:", error);
			toast.error("خطا در دریافت اطلاعات دسترسی‌ها");
		} finally {
			setLoading(false);
		}
	}, []);


	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchPermissions();
	}, [fetchPermissions]);


	const clearFilters = () => {
		setSearchTerm("");
	};

	const hasActiveFilters = !!searchTerm;

	function openAddDrawer() {
		setAddForm({ PermissionKey: "", PermissionName: "" });
		setAddDrawerOpen(true);
	}

	async function submitAdd() {
		if (!addForm.PermissionKey.trim()) {
			toast.error("کلید دسترسی را وارد کنید");
			return;
		}
		if (addForm.PermissionName.trim().length < 2) {
			toast.error("نام دسترسی نامعتبر است");
			return;
		}
		try {
			setAddSaving(true);
			const response = await fetch("/api/permissions/add", {
				method: "POST",
				body: JSON.stringify({
					PermissionKey: addForm.PermissionKey.trim(),
					PermissionName: addForm.PermissionName.trim(),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن دسترسی");
				return;
			}

			toast.success("دسترسی اضافه شد");
			setAddDrawerOpen(false);
			fetchPermissions();
		} catch (error) {
			console.error("Error adding permission:", error);
			toast.error("خطا در افزودن دسترسی");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(permission: PermissionItemType) {
		setEditForm({
			PermissionID: permission.PermissionID,
			PermissionKey: permission.PermissionKey,
			PermissionName: permission.PermissionName,
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (!editForm.PermissionKey.trim()) {
			toast.error("کلید دسترسی را وارد کنید");
			return;
		}
		if (editForm.PermissionName.trim().length < 2) {
			toast.error("نام دسترسی نامعتبر است");
			return;
		}
		try {
			setEditSaving(true);
			const response = await fetch("/api/permissions/edit", {
				method: "POST",
				body: JSON.stringify({
					PermissionID: editForm.PermissionID,
					PermissionKey: editForm.PermissionKey.trim(),
					PermissionName: editForm.PermissionName.trim(),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش دسترسی");
				return;
			}

			toast.success("دسترسی بروزرسانی شد");
			setEditDrawerOpen(false);
			fetchPermissions();
		} catch (error) {
			console.error("Error editing permission:", error);
			toast.error("خطا در ویرایش دسترسی");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch("/api/permissions/delete", {
				method: "POST",
				body: JSON.stringify({ PermissionID: deleteTarget.PermissionID }),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف دسترسی");
				return;
			}

			toast.success("دسترسی حذف شد");
			setDeleteTarget(null);
			fetchPermissions();
		} catch (error) {
			console.error("Error deleting permission:", error);
			toast.error("خطا در حذف دسترسی");
		} finally {
			setDeleteLoading(false);
		}
	}

	const filteredPermissions = useMemo<Array<PermissionItemType>>(() => {
		const list = permissionListData?.list ?? [];
		const term = searchTerm.trim().toLowerCase();
		if (!term) return list;
		return list.filter((permission) =>
			permission.PermissionName.toLowerCase().includes(term) ||
			permission.PermissionKey.toLowerCase().includes(term) ||
			String(permission.PermissionID).includes(term)
		);
	}, [permissionListData, searchTerm]);


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
					{/* <div className="lg:col-span-4">
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
								placeholder="جستجو بر اساس نام و کلید..."
								value={tempSearchTerm}
								onChange={handleSearchInputChange}
								onKeyDown={(e) => e.key === "Enter" ? handleSearchSubmit() : null}
								className="block w-full pr-2 py-3 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark
                      						rounded-full focus:border-primary text-sm placeholder:text-xs"
								style={{ paddingLeft: "50px" }}
							/>
						</div>
					</div> */}

					{/* Clear Filters Button */}
					<div className="lg:col-span-2">
						{hasActiveFilters && (
							<CustomButton
								onClick={clearFilters}
								title="حذف فیلترها"
								background="bg-red-400"
								icon={<CloseCircle size={18} />}
							/>
						)}
					</div>

					{/* Add Permission Button */}
					<div className="lg:col-span-2 lg:col-start-11 flex justify-end">
						<CustomButton
							onClick={openAddDrawer}
							title="افزودن دسترسی"
							icon={<AddSquare size={18} />}
						/>
					</div>
				</div>
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
										text-xs font-semibold uppercase tracking-wider
										${index === 0 ? "rounded-r-full" : ""}
										${index === columnHeads.length - 1 ? "rounded-l-full" : ""}
									`}
								>
									<div className={`flex items-center gap-2 ${head.textRight ? "justify-start" : "justify-center"}`}>
										{head.name}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-light dark:divide-gray-dark">
						{filteredPermissions.length > 0 ? (
							filteredPermissions.map((permission) => (
								<tr
									className="hover:bg-secondary/20 hover:rounded-full transition-colors group"
									key={permission.PermissionID}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
												<ShieldKeyhole size={18} className="text-primary" />
											</div>
											<div>
												<div className="text-sm font-medium">{permission.PermissionName}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary font-mono" dir="ltr">
											{permission.PermissionKey}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{permission.PermissionID}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										<div className="flex items-center justify-center gap-2">
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
												onClick={() => openEditor(permission)}
												aria-label="ویرایش"
											>
												<PenNewRound size={16} />
											</button>
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-500 hover:bg-red-400/20 transition-colors cursor-pointer"
												onClick={() => setDeleteTarget(permission)}
												aria-label="حذف"
											>
												<TrashBinMinimalistic size={16} />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columnHeads.length} className="px-6 py-12 text-center">
									<div className="flex flex-col items-center justify-center">
										<div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
											{hasActiveFilters ? (
												<MagniferZoomIn className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											) : (
												<ShieldKeyhole className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											)}
										</div>
										<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
											{hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ دسترسی‌ای یافت نشد"}
										</h3>
										<p className="text-gray-500 dark:text-gray-400 text-sm">
											{hasActiveFilters ? "لطفاً عبارت جستجو را تغییر دهید" : "هنوز دسترسی‌ای در سیستم ثبت نشده است"}
										</p>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>

			{/* Add Drawer */}
			<LeftDrawer isOpen={addDrawerOpen} onClose={() => setAddDrawerOpen(false)}>
				<div className="flex flex-col h-full space-y-4">
					<div className="flex items-center justify-center">
						<h2 className="text-xl font-semibold">افزودن دسترسی</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام دسترسی"
							icon={<TextField />}
							value={addForm.PermissionName}
							setValue={(value) => setAddForm((prev) => ({ ...prev, PermissionName: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="کلید دسترسی (مثلاً users.view)"
							icon={<Key />}
							value={addForm.PermissionKey}
							setValue={(value) => setAddForm((prev) => ({ ...prev, PermissionKey: value }))}
							handleAction={() => { }}
						/>
					</div>

					<div className="flex gap-2 w-full">
						<div className="flex-1">
							<CustomButton
								onClick={() => setAddDrawerOpen(false)}
								title="لغو"
								minWidth="w-full"
								background="bg-gray-200"
								foreground="text-gray-700"
							/>
						</div>
						<div className="flex-1">
							<CustomButton
								onClick={submitAdd}
								title="افزودن"
								minWidth="w-full"
								loading={addSaving}
								icon={<AddSquare size={18} />}
							/>
						</div>
					</div>
				</div>
			</LeftDrawer>

			{/* Edit Drawer */}
			<LeftDrawer isOpen={editDrawerOpen} onClose={() => setEditDrawerOpen(false)}>
				<div className="flex flex-col h-full space-y-4">
					<div className="flex items-center justify-center">
						<h2 className="text-xl font-semibold">ویرایش دسترسی</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام دسترسی"
							icon={<TextField />}
							value={editForm.PermissionName}
							setValue={(value) => setEditForm((prev) => ({ ...prev, PermissionName: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="کلید دسترسی (مثلاً users.view)"
							icon={<Key />}
							value={editForm.PermissionKey}
							setValue={(value) => setEditForm((prev) => ({ ...prev, PermissionKey: value }))}
							handleAction={() => { }}
						/>
					</div>

					<div className="flex gap-2 w-full">
						<div className="flex-1">
							<CustomButton
								onClick={() => setEditDrawerOpen(false)}
								title="لغو"
								minWidth="w-full"
								background="bg-gray-200"
								foreground="text-gray-700"
							/>
						</div>
						<div className="flex-1">
							<CustomButton
								onClick={submitEdit}
								title="ذخیره"
								minWidth="w-full"
								loading={editSaving}
								icon={<PenNewRound size={18} />}
							/>
						</div>
					</div>
				</div>
			</LeftDrawer>

			<ConfirmDialog
				isOpen={deleteTarget !== null}
				onClose={() => setDeleteTarget(null)}
				onConfirm={confirmDelete}
				isDestructive
				title="حذف دسترسی"
				message={`آیا از حذف «${deleteTarget?.PermissionName}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
