"use client";

import { useCallback, useEffect, useState } from "react";
import {
	AddSquare,
	CheckSquare,
	PenNewRound,
	Tag,
	TrashBinMinimalistic,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import TableShimmer from "@/components/shimmers/TableShimmer";
import toast from "react-hot-toast";

import { ActivityTypeListItem } from "@/lib/schemas/activity-type.schema";

export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام", percent: 32, textRight: false, sortable: false },
	{ id: "description", name: "توضیحات", percent: 48, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 20, textRight: false, sortable: false },
];

type ActivityTypeForm = {
	name: string;
	description: string;
};

const emptyForm: ActivityTypeForm = {
	name: "",
	description: "",
};

function getId(item: ActivityTypeListItem) {
	return item.ActivityTypeID ?? item.TypeID ?? item.ID ?? item.id;
}
function getName(item: ActivityTypeListItem) {
	return item.ActivityTypeName ?? item.ActivityName ?? item.name ?? item.Name ?? "";
}
function getDescription(item: ActivityTypeListItem) {
	return item.description ?? item.Description ?? "";
}

export default function AdminActivityTypes() {
	const [activityTypes, setActivityTypes] = useState<Array<ActivityTypeListItem>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState<ActivityTypeForm>(emptyForm);

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<ActivityTypeForm>(emptyForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<ActivityTypeListItem | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchActivityTypes = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/activity-types/list");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setActivityTypes(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching activity types data:", error);
			toast.error("خطا در دریافت انواع فعالیت");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchActivityTypes();
	}, [fetchActivityTypes]);

	function validateForm(form: ActivityTypeForm) {
		if (form.name.trim().length < 2) {
			toast.error("نام نامعتبر است");
			return false;
		}
		return true;
	}

	function buildPayload(form: ActivityTypeForm) {
		return {
			name: form.name.trim(),
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
			const response = await fetch("/api/activity-types/add", {
				method: "POST",
				body: JSON.stringify(buildPayload(addForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن نوع فعالیت");
				return;
			}

			toast.success("نوع فعالیت اضافه شد");
			setAddDrawerOpen(false);
			fetchActivityTypes();
		} catch (error) {
			console.error("Error adding activity type:", error);
			toast.error("خطا در افزودن نوع فعالیت");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(item: ActivityTypeListItem) {
		const id = getId(item);
		setEditingId(id ?? null);
		setEditForm({
			name: getName(item),
			description: getDescription(item),
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editingId === null) return;
		if (!validateForm(editForm)) return;
		try {
			setEditSaving(true);
			const response = await fetch(`/api/activity-types/update/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(buildPayload(editForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش نوع فعالیت");
				return;
			}

			toast.success("نوع فعالیت بروزرسانی شد");
			setEditDrawerOpen(false);
			setEditingId(null);
			fetchActivityTypes();
		} catch (error) {
			console.error("Error editing activity type:", error);
			toast.error("خطا در ویرایش نوع فعالیت");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		const id = getId(deleteTarget);
		if (id === undefined) return;
		try {
			setDeleteLoading(true);
			const response = await fetch(`/api/activity-types/delete/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف نوع فعالیت");
				return;
			}

			toast.success("نوع فعالیت حذف شد");
			setDeleteTarget(null);
			fetchActivityTypes();
		} catch (error) {
			console.error("Error deleting activity type:", error);
			toast.error("خطا در حذف نوع فعالیت");
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	const renderFormFields = (
		form: ActivityTypeForm,
		setForm: React.Dispatch<React.SetStateAction<ActivityTypeForm>>
	) => (
		<>
			<CustomInput
				placeholder="نام"
				icon={<Tag />}
				value={form.name}
				setValue={(value) => setForm((prev) => ({ ...prev, name: value }))}
				handleAction={() => { }}
			/>
			<CustomTextarea
				placeholder="توضیحات"
				value={form.description}
				setValue={(value) => setForm((prev) => ({ ...prev, description: value }))}
				handleAction={() => { }}
			/>
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
							title="افزودن نوع فعالیت"
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
							{activityTypes.length > 0 ? (
								activityTypes.map((item) => (
									<tr
										className="hover:bg-primary/10 hover:rounded-full transition-colors group"
										key={getId(item) ?? getName(item)}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
													<CheckSquare size={16} className="text-primary" />
												</div>
												<div className="text-sm font-medium">{getName(item)}</div>
											</div>
										</td>
										<td className="px-6 py-4 text-center text-sm text-gray-500">{getDescription(item) || "-"}</td>
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
												<CheckSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											</div>
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ نوع فعالیتی یافت نشد</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">هنوز نوع فعالیتی در سیستم ثبت نشده است</p>
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
						<h2 className="text-xl font-semibold">افزودن نوع فعالیت</h2>
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
						<h2 className="text-xl font-semibold">ویرایش نوع فعالیت</h2>
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
				title="حذف نوع فعالیت"
				message={`آیا از حذف «${deleteTarget ? getName(deleteTarget) : ""}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
