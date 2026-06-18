"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import {
	AddSquare,
	CloseCircle,
	MagniferZoomIn,
	PenNewRound,
	ShieldUser,
	TextField,
	TrashBinMinimalistic,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import toast from "react-hot-toast";

import { RoleItemType, RoleListResponse } from "@/lib/schemas/role-list.schema";
import TableShimmer from "@/components/shimmers/TableShimmer";


export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام نقش", percent: 30, textRight: false, sortable: false },
	{ id: "description", name: "توضیحات", percent: 45, textRight: false, sortable: false },
	{ id: "roleId", name: "شناسه", percent: 15, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type RoleForm = {
	RoleID: number;
	RoleName: string;
	RoleDescription: string;
};


export default function AdminRoles() {
	const router = useRouter();
	const [roleListData, setRoleListData] = useState<RoleListResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const [searchTerm, setSearchTerm] = useState("");

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<RoleForm>({
		RoleID: 0,
		RoleName: "",
		RoleDescription: "",
	});

	const [deleteTarget, setDeleteTarget] = useState<RoleItemType | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState({
		RoleName: "",
		RoleDescription: "",
	});

	const fetchRoles = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/roles");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setRoleListData(result);
		} catch (error) {
			console.error("Error fetching roles data:", error);
			toast.error("خطا در دریافت اطلاعات نقش‌ها");
		} finally {
			setLoading(false);
		}
	}, []);


	useEffect(() => {
		fetchRoles();
	}, [fetchRoles]);


	const clearFilters = () => {
		setSearchTerm("");
	};

	const hasActiveFilters = !!searchTerm;

	function openAddDrawer() {
		setAddForm({ RoleName: "", RoleDescription: "" });
		setAddDrawerOpen(true);
	}

	async function submitAdd() {
		if (addForm.RoleName.trim().length < 2) {
			toast.error("نام نقش نامعتبر است");
			return;
		}
		try {
			setAddSaving(true);
			const response = await fetch("/api/roles/add", {
				method: "POST",
				body: JSON.stringify({
					RoleName: addForm.RoleName.trim(),
					RoleDescription: addForm.RoleDescription.trim(),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن نقش");
				return;
			}

			toast.success("نقش اضافه شد");
			setAddDrawerOpen(false);
			fetchRoles();
		} catch (error) {
			console.error("Error adding role:", error);
			toast.error("خطا در افزودن نقش");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(role: RoleItemType) {
		setEditForm({
			RoleID: role.RoleID,
			RoleName: role.RoleName,
			RoleDescription: role.RoleDescription,
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editForm.RoleName.trim().length < 2) {
			toast.error("نام نقش نامعتبر است");
			return;
		}
		try {
			setEditSaving(true);
			const response = await fetch("/api/roles/edit", {
				method: "POST",
				body: JSON.stringify({
					RoleID: editForm.RoleID,
					RoleName: editForm.RoleName.trim(),
					RoleDescription: editForm.RoleDescription.trim(),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش نقش");
				return;
			}

			toast.success("نقش بروزرسانی شد");
			setEditDrawerOpen(false);
			fetchRoles();
		} catch (error) {
			console.error("Error editing role:", error);
			toast.error("خطا در ویرایش نقش");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch("/api/roles/delete", {
				method: "POST",
				body: JSON.stringify({ RoleID: deleteTarget.RoleID }),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف نقش");
				return;
			}

			toast.success("نقش حذف شد");
			setDeleteTarget(null);
			fetchRoles();
		} catch (error) {
			console.error("Error deleting role:", error);
			toast.error("خطا در حذف نقش");
		} finally {
			setDeleteLoading(false);
		}
	}

	const filteredRoles = useMemo<Array<RoleItemType>>(() => {
		const list = roleListData?.list ?? [];
		const term = searchTerm.trim().toLowerCase();
		if (!term) return list;
		return list.filter((role) =>
			role.RoleName.toLowerCase().includes(term) ||
			role.RoleDescription.toLowerCase().includes(term) ||
			String(role.RoleID).includes(term)
		);
	}, [roleListData, searchTerm]);


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
								placeholder="جستجو بر اساس نام و توضیحات..."
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

					{/* Add Role Button */}
					<div className="lg:col-span-2 lg:col-start-11 flex justify-end">
						<CustomButton
							onClick={openAddDrawer}
							title="افزودن نقش"
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
						{filteredRoles.length > 0 ? (
							filteredRoles.map((role) => (
								<tr
									className="hover:bg-primary/10 hover:rounded-full transition-colors cursor-pointer group"
									key={role.RoleID}
									onClick={() => {
										useBreadcrumbStore.getState().setName(role.RoleName);
										router.push(`/roles/${role.RoleID}`);
									}}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
												<ShieldUser size={18} className="text-primary" />
											</div>
											<div>
												<div className="text-sm font-medium">{role.RoleName}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-center text-sm">{role.RoleDescription || "-"}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{role.RoleID}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										<div className="flex items-center justify-center gap-2">
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
												onClick={(e) => { e.stopPropagation(); openEditor(role); }}
												aria-label="ویرایش"
											>
												<PenNewRound size={16} />
											</button>
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-500 hover:bg-red-400/20 transition-colors cursor-pointer"
												onClick={(e) => { e.stopPropagation(); setDeleteTarget(role); }}
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
												<ShieldUser className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											)}
										</div>
										<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
											{hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ نقشی یافت نشد"}
										</h3>
										<p className="text-gray-500 dark:text-gray-400 text-sm">
											{hasActiveFilters ? "لطفاً عبارت جستجو را تغییر دهید" : "هنوز نقشی در سیستم ثبت نشده است"}
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
						<h2 className="text-xl font-semibold">افزودن نقش</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام نقش"
							icon={<ShieldUser />}
							value={addForm.RoleName}
							setValue={(value) => setAddForm((prev) => ({ ...prev, RoleName: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="توضیحات"
							icon={<TextField />}
							value={addForm.RoleDescription}
							setValue={(value) => setAddForm((prev) => ({ ...prev, RoleDescription: value }))}
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
						<h2 className="text-xl font-semibold">ویرایش نقش</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام نقش"
							icon={<ShieldUser />}
							value={editForm.RoleName}
							setValue={(value) => setEditForm((prev) => ({ ...prev, RoleName: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="توضیحات"
							icon={<TextField />}
							value={editForm.RoleDescription}
							setValue={(value) => setEditForm((prev) => ({ ...prev, RoleDescription: value }))}
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
				title="حذف نقش"
				message={`آیا از حذف «${deleteTarget?.RoleName}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
