"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
	AddSquare,
	CaseMinimalistic,
	PenNewRound,
	TrashBinMinimalistic,
	UserRounded,
} from "@solar-icons/react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import CustomButton from "@/components/widgets/CustomButton";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import CustomInput from "@/components/widgets/CustomInput";
import CustomSwitch from "@/components/widgets/CustomSwitch";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import TableShimmer from "@/components/shimmers/TableShimmer";
import toast from "react-hot-toast";

import { ProjectListItem } from "@/lib/schemas/project.schema";
import { UserItemType } from "@/lib/schemas/user-list.schema";

export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "title", name: "عنوان", percent: 22, textRight: false, sortable: false },
	{ id: "manager", name: "مدیر پروژه", percent: 20, textRight: false, sortable: false },
	{ id: "status", name: "وضعیت", percent: 14, textRight: false, sortable: false },
	{ id: "start", name: "تاریخ شروع", percent: 16, textRight: false, sortable: false },
	{ id: "end", name: "تاریخ پایان", percent: 16, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 12, textRight: false, sortable: false },
];

type ProjectForm = {
	title: string;
	manager: string;
	status: string;
	start: string;
	end: string;
	description: string;
};

const emptyForm: ProjectForm = {
	title: "",
	manager: "",
	status: "active",
	start: "",
	end: "",
	description: "",
};

function getTitle(item: ProjectListItem) {
	return item.ProjectTitle ?? item.title ?? item.Title ?? "";
}
function getManagerId(item: ProjectListItem) {
	const v = item.ProjectManagerID ?? item.manager;
	return v === undefined || v === null ? "" : String(v);
}
function getManagerName(item: ProjectListItem) {
	return item.ProjectManagerName ?? "";
}
function getStatus(item: ProjectListItem) {
	return item.Status ?? item.status ?? "";
}
function getStart(item: ProjectListItem) {
	return item.StartDate ?? item.start ?? "";
}
function getEnd(item: ProjectListItem) {
	return item.EndDate ?? item.end ?? "";
}
function getDescription(item: ProjectListItem) {
	return item.Description ?? item.description ?? "";
}

// The backend stores dates as Gregorian GMT strings; the add/edit API expects a
// Gregorian "YYYY-MM-DD". Normalize any incoming value to that.
function toGregorianYMD(value?: string | null) {
	if (!value) return "";
	const d = new Date(value);
	if (isNaN(d.getTime())) return value;
	const m = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day = String(d.getUTCDate()).padStart(2, "0");
	return `${d.getUTCFullYear()}-${m}-${day}`;
}

// The form holds dates as Persian (Jalali) "YYYY-MM-DD" strings so the picker
// stays in sync; we convert to/from Gregorian only at the API boundary.
function gregorianYMDToPersian(ymd: string): string {
	if (!ymd) return "";
	return new DateObject({ date: ymd, format: "YYYY-MM-DD", calendar: gregorian })
		.convert(persian)
		.format("YYYY-MM-DD");
}
function persianYMDToGregorian(ymd: string): string {
	if (!ymd) return "";
	return new DateObject({ date: ymd, format: "YYYY-MM-DD", calendar: persian })
		.convert(gregorian)
		.format("YYYY-MM-DD");
}

// Show a Gregorian YYYY-MM-DD value as a Persian (Jalali) date string for tables.
function toPersianDisplay(value?: string | null) {
	const ymd = toGregorianYMD(value);
	if (!ymd) return "-";
	return new DateObject({ date: ymd, format: "YYYY-MM-DD", calendar: gregorian })
		.convert(persian)
		.format("YYYY/MM/DD");
}

export default function AdminProjects() {
	const { data: session } = useSession();

	useEffect(() => {
		const accessToken = (session as unknown as { accessToken?: string })?.accessToken;
		if (accessToken) {
			console.log("ACCESS TOKEN:", accessToken);
		}
	}, [session]);

	const [projects, setProjects] = useState<Array<ProjectListItem>>([]);
	const [users, setUsers] = useState<Array<UserItemType>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState<ProjectForm>(emptyForm);

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<ProjectForm>(emptyForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<ProjectListItem | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchProjects = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/projects/list");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setProjects(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching projects data:", error);
			toast.error("خطا در دریافت پروژه‌ها");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchUsers = useCallback(async () => {
		try {
			const response = await fetch("/api/users");
			if (!response.ok) return;

			const result = await response.json();
			setUsers(Array.isArray(result?.list) ? result.list : []);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchProjects();
		fetchUsers();
	}, [fetchProjects, fetchUsers]);

	function managerLabel(managerId: string) {
		if (!managerId) return "";
		const found = users.find((u) => String(u.UserID) === managerId);
		return found ? found.Name : managerId;
	}

	function validateForm(form: ProjectForm) {
		if (form.title.trim().length < 2) {
			toast.error("عنوان پروژه نامعتبر است");
			return false;
		}
		if (!form.start.trim()) {
			toast.error("تاریخ شروع را انتخاب کنید");
			return false;
		}
		return true;
	}

	function buildPayload(form: ProjectForm) {
		return {
			title: form.title.trim(),
			manager: form.manager.trim() === "" ? null : form.manager.trim(),
			status: form.status.trim(),
			start: persianYMDToGregorian(form.start.trim()),
			end: form.end.trim() === "" ? null : persianYMDToGregorian(form.end.trim()),
			description: form.description.trim(),
		};
	}

	function openAddDrawer() {
		setAddForm(emptyForm);
		setAddDrawerOpen(true);
	}

	async function submitAdd() {
		if (!validateForm(addForm)) return;
		try {
			setAddSaving(true);
			const response = await fetch("/api/projects/add", {
				method: "POST",
				body: JSON.stringify(buildPayload(addForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن پروژه");
				return;
			}

			toast.success("پروژه اضافه شد");
			setAddDrawerOpen(false);
			fetchProjects();
		} catch (error) {
			console.error("Error adding project:", error);
			toast.error("خطا در افزودن پروژه");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(item: ProjectListItem) {
		setEditingId(item.ProjectID ?? null);
		setEditForm({
			title: getTitle(item),
			manager: getManagerId(item),
			status: getStatus(item) || "active",
			start: gregorianYMDToPersian(toGregorianYMD(getStart(item))),
			end: gregorianYMDToPersian(toGregorianYMD(getEnd(item))),
			description: getDescription(item),
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editingId === null) return;
		if (!validateForm(editForm)) return;
		try {
			setEditSaving(true);
			const response = await fetch(`/api/projects/update/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(buildPayload(editForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش پروژه");
				return;
			}

			toast.success("پروژه بروزرسانی شد");
			setEditDrawerOpen(false);
			setEditingId(null);
			fetchProjects();
		} catch (error) {
			console.error("Error editing project:", error);
			toast.error("خطا در ویرایش پروژه");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget || deleteTarget.ProjectID === undefined) return;
		try {
			setDeleteLoading(true);
			const response = await fetch(`/api/projects/delete/${deleteTarget.ProjectID}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف پروژه");
				return;
			}

			toast.success("پروژه حذف شد");
			setDeleteTarget(null);
			fetchProjects();
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("خطا در حذف پروژه");
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	const renderFormFields = (
		form: ProjectForm,
		setForm: React.Dispatch<React.SetStateAction<ProjectForm>>
	) => (
		<>
			<CustomInput
				placeholder="عنوان پروژه"
				icon={<CaseMinimalistic />}
				value={form.title}
				setValue={(value) => setForm((prev) => ({ ...prev, title: value }))}
				handleAction={() => { }}
			/>
			<div className="space-y-1">
				<CustomDropdown
					value={form.manager}
					onChange={(value) => setForm((prev) => ({ ...prev, manager: String(value) }))}
					options={users.map((u) => ({ value: String(u.UserID), label: `${u.Name} (${u.UserID})` }))}
					placeholder="انتخاب مدیر"
					icon={<UserRounded />}
				/>
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
			<div className="space-y-1">
				<DatePicker
					calendar={persian}
					locale={persian_fa}
					format="YYYY-MM-DD"
					calendarPosition="bottom-right"
					value={form.start || ""}
					onChange={(date) => {
						const d = Array.isArray(date) ? date[0] : date;
						setForm((prev) => ({ ...prev, start: d ? d.format("YYYY-MM-DD") : "" }));
					}}
					containerClassName="w-full"
					inputClass="w-full rounded-full border border-gray-light dark:border-gray-dark bg-white dark:bg-background-dark px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
					placeholder="تاریخ شروع"
				/>
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
			<div className="space-y-1">
				<DatePicker
					calendar={persian}
					locale={persian_fa}
					format="YYYY-MM-DD"
					calendarPosition="bottom-right"
					value={form.end || ""}
					onChange={(date) => {
						const d = Array.isArray(date) ? date[0] : date;
						setForm((prev) => ({ ...prev, end: d ? d.format("YYYY-MM-DD") : "" }));
					}}
					containerClassName="w-full"
					inputClass="w-full rounded-full border border-gray-light dark:border-gray-dark bg-white dark:bg-background-dark px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
					placeholder="تاریخ پایان"
				/>
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
			<CustomTextarea
				placeholder="توضیحات"
				value={form.description}
				setValue={(value) => setForm((prev) => ({ ...prev, description: value }))}
				handleAction={() => { }}
			/>
			<div className="space-y-1">
				<div className="flex items-center justify-between rounded-full border border-gray-light dark:border-gray-dark bg-white dark:bg-background-dark px-4 py-3">
					<span className="text-sm font-medium">
						وضعیت: {form.status === "active" ? "فعال" : "غیرفعال"}
					</span>
					<CustomSwitch
						checked={form.status === "active"}
						onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.checked ? "active" : "inactive" }))}
					/>
				</div>
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
		</>
	);

	return (
		<>
			<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
				{/* Header */}
				<div className="p-6">
					<div className="flex justify-end">
						<CustomButton
							onClick={openAddDrawer}
							title="افزودن پروژه"
							icon={<AddSquare size={18} />}
						/>
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
							{projects.length > 0 ? (
								projects.map((item) => (
									<tr
										className="hover:bg-primary/10 hover:rounded-full transition-colors group"
										key={item.ProjectID ?? getTitle(item)}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
													<CaseMinimalistic size={16} className="text-primary" />
												</div>
												<div className="text-sm font-medium">{getTitle(item)}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">
											{getManagerName(item) || managerLabel(getManagerId(item)) || "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											{getStatus(item) ? (
												<span
													className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatus(item) === "active"
														? "bg-green-400/10 text-green-600"
														: "bg-gray-400/10 text-gray-500"
														}`}
												>
													{getStatus(item) === "active" ? "فعال" : "غیرفعال"}
												</span>
											) : (
												"-"
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{toPersianDisplay(getStart(item))}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{toPersianDisplay(getEnd(item))}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<div className="flex items-center justify-center gap-2">
												<button
													className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
													onClick={() => openEditor(item)}
													aria-label="ویرایش"
												>
													<PenNewRound size={16} />
												</button>
												<button
													className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-500 hover:bg-red-400/20 transition-colors cursor-pointer"
													onClick={() => setDeleteTarget(item)}
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
												<CaseMinimalistic className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											</div>
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ پروژه‌ای یافت نشد</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">هنوز پروژه‌ای در سیستم ثبت نشده است</p>
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
						<h2 className="text-xl font-semibold">افزودن پروژه</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						{renderFormFields(addForm, setAddForm)}
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
			<LeftDrawer isOpen={editDrawerOpen} onClose={() => { setEditDrawerOpen(false); setEditingId(null); }}>
				<div className="flex flex-col h-full space-y-4">
					<div className="flex items-center justify-center">
						<h2 className="text-xl font-semibold">ویرایش پروژه</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						{renderFormFields(editForm, setEditForm)}
					</div>

					<div className="flex gap-2 w-full">
						<div className="flex-1">
							<CustomButton
								onClick={() => { setEditDrawerOpen(false); setEditingId(null); }}
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
				title="حذف پروژه"
				message={`آیا از حذف «${deleteTarget ? getTitle(deleteTarget) : ""}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
