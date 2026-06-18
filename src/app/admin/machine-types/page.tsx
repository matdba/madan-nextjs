"use client";

import { useCallback, useEffect, useState } from "react";
import {
	AddSquare,
	Box,
	Buildings2,
	Buildings3,
	ClockCircle,
	PenNewRound,
	Tag,
	TrashBinMinimalistic,
	WheelAngle,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import TableShimmer from "@/components/shimmers/TableShimmer";
import toast from "react-hot-toast";

import { MachineTypeListItem } from "@/lib/schemas/machine-type.schema";

export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام", percent: 20, textRight: false, sortable: false },
	{ id: "category", name: "دسته‌بندی", percent: 16, textRight: false, sortable: false },
	{ id: "manufacturer", name: "سازنده", percent: 16, textRight: false, sortable: false },
	{ id: "model", name: "مدل", percent: 14, textRight: false, sortable: false },
	{ id: "serviceHours", name: "ساعت سرویس", percent: 14, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type MachineTypeForm = {
	name: string;
	category: string;
	manufacturer: string;
	model: string;
	service_hours: string;
	description: string;
};

const emptyForm: MachineTypeForm = {
	name: "",
	category: "",
	manufacturer: "",
	model: "",
	service_hours: "",
	description: "",
};

function getName(item: MachineTypeListItem) {
	return item.MachineTypeName ?? item.name ?? item.Name ?? "";
}
function getCategory(item: MachineTypeListItem) {
	return item.category ?? item.Category ?? item.MachineCategory ?? "";
}
function getManufacturer(item: MachineTypeListItem) {
	return item.manufacturer ?? item.Manufacturer ?? "";
}
function getModel(item: MachineTypeListItem) {
	return item.model ?? item.Model ?? "";
}
function getServiceHours(item: MachineTypeListItem) {
	return item.service_hours ?? item.ServiceHours ?? item.StandardServiceHours ?? undefined;
}
function getDescription(item: MachineTypeListItem) {
	return item.description ?? item.Description ?? "";
}

export default function AdminMachineTypes() {
	const [machineTypes, setMachineTypes] = useState<Array<MachineTypeListItem>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState<MachineTypeForm>(emptyForm);

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<MachineTypeForm>(emptyForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<MachineTypeListItem | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchMachineTypes = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/machine-types/list");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setMachineTypes(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching machine types data:", error);
			toast.error("خطا در دریافت انواع ماشین");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMachineTypes();
	}, [fetchMachineTypes]);

	function validateForm(form: MachineTypeForm) {
		if (form.name.trim().length < 2) {
			toast.error("نام نامعتبر است");
			return false;
		}
		return true;
	}

	function buildPayload(form: MachineTypeForm) {
		return {
			name: form.name.trim(),
			category: form.category.trim(),
			manufacturer: form.manufacturer.trim(),
			model: form.model.trim(),
			service_hours: Number(form.service_hours) || 0,
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
			const response = await fetch("/api/machine-types/add", {
				method: "POST",
				body: JSON.stringify(buildPayload(addForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن نوع ماشین");
				return;
			}

			toast.success("نوع ماشین اضافه شد");
			setAddDrawerOpen(false);
			fetchMachineTypes();
		} catch (error) {
			console.error("Error adding machine type:", error);
			toast.error("خطا در افزودن نوع ماشین");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(item: MachineTypeListItem) {
		setEditingId(item.TypeID);
		const hours = getServiceHours(item);
		setEditForm({
			name: getName(item),
			category: getCategory(item),
			manufacturer: getManufacturer(item),
			model: getModel(item),
			service_hours: hours !== undefined ? String(hours) : "",
			description: getDescription(item),
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editingId === null) return;
		if (!validateForm(editForm)) return;
		try {
			setEditSaving(true);
			const response = await fetch(`/api/machine-types/update/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(buildPayload(editForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش نوع ماشین");
				return;
			}

			toast.success("نوع ماشین بروزرسانی شد");
			setEditDrawerOpen(false);
			setEditingId(null);
			fetchMachineTypes();
		} catch (error) {
			console.error("Error editing machine type:", error);
			toast.error("خطا در ویرایش نوع ماشین");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch(`/api/machine-types/delete/${deleteTarget.TypeID}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف نوع ماشین");
				return;
			}

			toast.success("نوع ماشین حذف شد");
			setDeleteTarget(null);
			fetchMachineTypes();
		} catch (error) {
			console.error("Error deleting machine type:", error);
			toast.error("خطا در حذف نوع ماشین");
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	const renderFormFields = (
		form: MachineTypeForm,
		setForm: React.Dispatch<React.SetStateAction<MachineTypeForm>>
	) => (
		<>
			<CustomInput
				placeholder="نام"
				icon={<Tag />}
				value={form.name}
				setValue={(value) => setForm((prev) => ({ ...prev, name: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="دسته‌بندی"
				icon={<Box />}
				value={form.category}
				setValue={(value) => setForm((prev) => ({ ...prev, category: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="سازنده"
				icon={<Buildings2 />}
				value={form.manufacturer}
				setValue={(value) => setForm((prev) => ({ ...prev, manufacturer: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="مدل"
				icon={<Buildings3 />}
				value={form.model}
				setValue={(value) => setForm((prev) => ({ ...prev, model: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="ساعت سرویس"
				icon={<ClockCircle />}
				value={form.service_hours}
				setValue={(value) => setForm((prev) => ({ ...prev, service_hours: value }))}
				handleAction={() => { }}
				type="number"
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
							title="افزودن نوع ماشین"
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
							{machineTypes.length > 0 ? (
								machineTypes.map((item) => (
									<tr
										className="hover:bg-primary/10 hover:rounded-full transition-colors group"
										key={item.TypeID}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
													<span className="text-sm font-medium text-primary">{getName(item).charAt(0)}</span>
												</div>
												<div className="text-sm font-medium">{getName(item)}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getCategory(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getManufacturer(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getModel(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">
											{getServiceHours(item) !== undefined ? getServiceHours(item) : "-"}
										</td>
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
												<WheelAngle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											</div>
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ نوع ماشینی یافت نشد</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">هنوز نوع ماشینی در سیستم ثبت نشده است</p>
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
						<h2 className="text-xl font-semibold">افزودن نوع ماشین</h2>
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
						<h2 className="text-xl font-semibold">ویرایش نوع ماشین</h2>
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
				title="حذف نوع ماشین"
				message={`آیا از حذف «${deleteTarget ? getName(deleteTarget) : ""}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
