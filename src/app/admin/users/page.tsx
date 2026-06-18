"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import {
	AddSquare,
	Card,
	CloseCircle,
	LockPassword,
	MagniferZoomIn,
	PenNewRound,
	PhoneCallingRounded,
	TrashBinMinimalistic,
	UserRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomSwitch from "@/components/widgets/CustomSwitch";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import toast from "react-hot-toast";

import { UserItemType, UserListResponse } from "@/lib/schemas/user-list.schema";
import TableShimmer from "@/components/shimmers/TableShimmer";


export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام", percent: 30, textRight: false, sortable: false },
	{ id: "userId", name: "شناسه کاربری", percent: 20, textRight: false, sortable: false },
	{ id: "phone", name: "شماره تماس", percent: 20, textRight: false, sortable: false },
	{ id: "status", name: "وضعیت", percent: 15, textRight: false, sortable: false },
	{ id: "createdAt", name: "تاریخ ثبت", percent: 15, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type EditForm = {
	UserID: string;
	Name: string;
	UserPhoneNumber: string;
	IsActive: number;
};


function formatDate(value: string) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	try {
		return date.toLocaleDateString("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return value;
	}
}


export default function AdminUsers() {
	const router = useRouter();
	const [userListData, setUserListData] = useState<UserListResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const [searchTerm, setSearchTerm] = useState("");

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<EditForm>({
		UserID: "",
		Name: "",
		UserPhoneNumber: "",
		IsActive: 1,
	});

	const [deleteTarget, setDeleteTarget] = useState<UserItemType | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState({
		UserID: "",
		UserPass: "",
		Name: "",
		UserPhoneNumber: "",
		IsActive: 1,
	});

	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/users");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setUserListData(result);
		} catch (error) {
			console.error("Error fetching users data:", error);
			toast.error("خطا در دریافت اطلاعات کاربران");
		} finally {
			setLoading(false);
		}
	}, []);


	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);


	const clearFilters = () => {
		setSearchTerm("");
	};

	const hasActiveFilters = !!searchTerm;

	function openAddDrawer() {
		setAddForm({ UserID: "", UserPass: "", Name: "", UserPhoneNumber: "", IsActive: 1 });
		setAddDrawerOpen(true);
	}

	async function submitAdd() {
		if (!addForm.UserID.trim()) {
			toast.error("شناسه کاربر را وارد کنید");
			return;
		}
		if (addForm.Name.trim().length < 2) {
			toast.error("نام نامعتبر است");
			return;
		}
		if (!addForm.UserPass.trim()) {
			toast.error("رمز عبور را وارد کنید");
			return;
		}
		try {
			setAddSaving(true);
			const response = await fetch("/api/users/add", {
				method: "POST",
				body: JSON.stringify({
					UserID: addForm.UserID.trim(),
					UserPass: addForm.UserPass.trim(),
					Name: addForm.Name.trim(),
					UserPhoneNumber: addForm.UserPhoneNumber.trim(),
					IsActive: addForm.IsActive,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن کاربر");
				return;
			}

			toast.success("کاربر اضافه شد");
			setAddDrawerOpen(false);
			fetchUsers();
		} catch (error) {
			console.error("Error adding user:", error);
			toast.error("خطا در افزودن کاربر");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(user: UserItemType) {
		setEditForm({
			UserID: user.UserID,
			Name: user.Name,
			UserPhoneNumber: user.UserPhoneNumber,
			IsActive: user.IsActive,
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editForm.Name.trim().length < 2) {
			toast.error("نام نامعتبر است");
			return;
		}
		try {
			setEditSaving(true);
			const response = await fetch("/api/users/edit", {
				method: "POST",
				body: JSON.stringify({
					UserID: editForm.UserID,
					Name: editForm.Name.trim(),
					UserPhoneNumber: editForm.UserPhoneNumber.trim(),
					IsActive: editForm.IsActive,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش کاربر");
				return;
			}

			toast.success("کاربر بروزرسانی شد");
			setEditDrawerOpen(false);
			fetchUsers();
		} catch (error) {
			console.error("Error editing user:", error);
			toast.error("خطا در ویرایش کاربر");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch("/api/users/delete", {
				method: "POST",
				body: JSON.stringify({ UserID: deleteTarget.UserID }),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف کاربر");
				return;
			}

			toast.success("کاربر حذف شد");
			setDeleteTarget(null);
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("خطا در حذف کاربر");
		} finally {
			setDeleteLoading(false);
		}
	}

	const filteredUsers = useMemo<Array<UserItemType>>(() => {
		const list = userListData?.list ?? [];
		const term = searchTerm.trim().toLowerCase();
		if (!term) return list;
		return list.filter((user) =>
			user.Name.toLowerCase().includes(term) ||
			user.UserID.toLowerCase().includes(term) ||
			user.UserPhoneNumber.toLowerCase().includes(term)
		);
	}, [userListData, searchTerm]);


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
								placeholder="جستجو بر اساس نام، شناسه و تلفن..."
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

					{/* Add User Button */}
					<div className="lg:col-span-2 lg:col-start-11 flex justify-end">
						<CustomButton
							onClick={openAddDrawer}
							title="افزودن کاربر"
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
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<tr
									className="hover:bg-primary/10 hover:rounded-full transition-colors cursor-pointer group"
									key={user.UserID}
									onClick={() => {
										useBreadcrumbStore.getState().setName(user.Name);
										router.push(`/users/${user.UserID}`);
									}}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
												<span className="text-sm font-medium text-primary">{user.Name.charAt(0)}</span>
											</div>
											<div>
												<div className="text-sm font-medium">{user.Name}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{user.UserID}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{user.UserPhoneNumber}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
											${user.IsActive
												? "bg-green-500/10 text-green-500"
												: "bg-red-500/10 text-red-500"
											}`}
										>
											{user.IsActive ? "فعال" : "غیرفعال"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{formatDate(user.CreatAt)}</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										<div className="flex items-center justify-center gap-2">
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
												onClick={(e) => { e.stopPropagation(); openEditor(user); }}
												aria-label="ویرایش"
											>
												<PenNewRound size={16} />
											</button>
											<button
												className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-500 hover:bg-red-400/20 transition-colors cursor-pointer"
												onClick={(e) => { e.stopPropagation(); setDeleteTarget(user); }}
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
												<UserRounded className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											)}
										</div>
										<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
											{hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ کاربری یافت نشد"}
										</h3>
										<p className="text-gray-500 dark:text-gray-400 text-sm">
											{hasActiveFilters ? "لطفاً عبارت جستجو را تغییر دهید" : "هنوز کاربری در سیستم ثبت نشده است"}
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
						<h2 className="text-xl font-semibold">افزودن کاربر</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="شناسه کاربر"
							icon={<Card />}
							value={addForm.UserID}
							setValue={(value) => setAddForm((prev) => ({ ...prev, UserID: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="نام"
							icon={<UserRounded />}
							value={addForm.Name}
							setValue={(value) => setAddForm((prev) => ({ ...prev, Name: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="شماره تماس"
							icon={<PhoneCallingRounded />}
							value={addForm.UserPhoneNumber}
							maxLength={11}
							setValue={(value) => setAddForm((prev) => ({ ...prev, UserPhoneNumber: value }))}
							handleAction={() => { }}
							type="number"
						/>

						<CustomInput
							placeholder="رمز عبور"
							icon={<LockPassword />}
							value={addForm.UserPass}
							setValue={(value) => setAddForm((prev) => ({ ...prev, UserPass: value }))}
							handleAction={() => { }}
							type="password"
						/>

						<div className="flex items-center justify-between px-2 py-2">
							<span className="text-sm font-medium">وضعیت فعال بودن</span>
							<CustomSwitch
								checked={addForm.IsActive === 1}
								onChange={(e) => setAddForm((prev) => ({ ...prev, IsActive: e.target.checked ? 1 : 0 }))}
							/>
						</div>
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
						<h2 className="text-xl font-semibold">ویرایش کاربر</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام"
							icon={<UserRounded />}
							value={editForm.Name}
							setValue={(value) => setEditForm((prev) => ({ ...prev, Name: value }))}
							handleAction={() => { }}
						/>

						<CustomInput
							placeholder="شماره تماس"
							icon={<PhoneCallingRounded />}
							value={editForm.UserPhoneNumber}
							maxLength={11}
							setValue={(value) => setEditForm((prev) => ({ ...prev, UserPhoneNumber: value }))}
							handleAction={() => { }}
							type="number"
						/>

						<div className="flex items-center justify-between px-2 py-2">
							<span className="text-sm font-medium">وضعیت فعال بودن</span>
							<CustomSwitch
								checked={editForm.IsActive === 1}
								onChange={(e) => setEditForm((prev) => ({ ...prev, IsActive: e.target.checked ? 1 : 0 }))}
							/>
						</div>
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
				title="حذف کاربر"
				message={`آیا از حذف «${deleteTarget?.Name}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
