"use client";

import { useCallback, useEffect, useState } from "react";
import {
	AddSquare,
	Calendar,
	Card,
	ClipboardList,
	Hashtag,
	PenNewRound,
	TrashBinMinimalistic,
	Tuning2,
	WheelAngle,
} from "@solar-icons/react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomSwitch from "@/components/widgets/CustomSwitch";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import TableShimmer from "@/components/shimmers/TableShimmer";
import toast from "react-hot-toast";

import { MachineryListItem } from "@/lib/schemas/machinery.schema";
import { MachineTypeListItem } from "@/lib/schemas/machine-type.schema";

export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "type", name: "نوع ماشین", percent: 20, textRight: false, sortable: false },
	{ id: "plate", name: "پلاک", percent: 16, textRight: false, sortable: false },
	{ id: "serial", name: "سریال", percent: 16, textRight: false, sortable: false },
	{ id: "year", name: "سال", percent: 10, textRight: false, sortable: false },
	{ id: "ownership", name: "مالکیت", percent: 14, textRight: false, sortable: false },
	{ id: "status", name: "وضعیت", percent: 12, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type MachineryForm = {
	type_id: number | null;
	year: string;
	plate: string;
	serial: string;
	start_date: string;
	ownership: string;
	status: boolean;
	description: string;
};

const emptyForm: MachineryForm = {
	type_id: null,
	year: "",
	plate: "",
	serial: "",
	start_date: "",
	ownership: "",
	status: false,
	description: "",
};

function statusToBool(value?: string | number) {
	if (value === undefined) return false;
	if (typeof value === "number") return value !== 0;
	const v = value.trim().toLowerCase();
	return v === "1" || v === "true" || v === "active" || v === "فعال";
}

function machineTypeName(item: MachineTypeListItem) {
	return item.MachineTypeName ?? item.name ?? item.Name ?? `#${item.TypeID}`;
}

function getPlate(item: MachineryListItem) {
	return item.NumberPlate ?? item.plate ?? item.Plate ?? "";
}
function getSerial(item: MachineryListItem) {
	return item.serial ?? item.Serial ?? item.SerialNumber ?? "";
}
function getYear(item: MachineryListItem) {
	return item.year ?? item.Year ?? item.ManufactureYear ?? undefined;
}
function getStartDate(item: MachineryListItem) {
	return item.start_date ?? item.StartDate ?? item.StartWorkDate ?? "";
}
function getOwnership(item: MachineryListItem) {
	return item.ownership ?? item.Ownership ?? "";
}

// The backend stores StartWorkDate as a Gregorian GMT string; the add/edit API
// expects a Gregorian "YYYY-MM-DD". Normalize any incoming value to that.
function toGregorianYMD(value?: string) {
	if (!value) return "";
	const d = new Date(value);
	if (isNaN(d.getTime())) return value;
	const m = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day = String(d.getUTCDate()).padStart(2, "0");
	return `${d.getUTCFullYear()}-${m}-${day}`;
}

// The form holds the date as a Persian (Jalali) "YYYY-MM-DD" string so the picker
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

function getStatus(item: MachineryListItem) {
	return item.status ?? item.Status;
}
function getDescription(item: MachineryListItem) {
	return item.description ?? item.Description ?? "";
}

export default function AdminMachinery() {
	const [machinery, setMachinery] = useState<Array<MachineryListItem>>([]);
	const [machineTypes, setMachineTypes] = useState<Array<MachineTypeListItem>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState<MachineryForm>(emptyForm);

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<MachineryForm>(emptyForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<MachineryListItem | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchMachinery = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/machinery/list");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			setMachinery(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching machinery data:", error);
			toast.error("خطا در دریافت ماشین‌آلات");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMachineTypes = useCallback(async () => {
		try {
			const response = await fetch("/api/machine-types/list");
			if (!response.ok) return;

			const result = await response.json();
			setMachineTypes(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching machine types:", error);
		}
	}, []);

	useEffect(() => {
		fetchMachinery();
		fetchMachineTypes();
	}, [fetchMachinery, fetchMachineTypes]);

	function typeNameById(typeId?: number) {
		if (typeId === undefined) return "";
		const found = machineTypes.find((t) => t.TypeID === typeId);
		return found ? machineTypeName(found) : "";
	}

	function rowTypeName(item: MachineryListItem) {
		return item.MachineTypeName ?? typeNameById(item.TypeID) ?? "";
	}

	function validateForm(form: MachineryForm) {
		if (form.type_id === null) {
			toast.error("نوع ماشین را انتخاب کنید");
			return false;
		}
		if (!form.plate.trim()) {
			toast.error("پلاک را وارد کنید");
			return false;
		}
		return true;
	}

	function buildPayload(form: MachineryForm) {
		return {
			type_id: form.type_id ?? 0,
			year: Number(form.year) || 0,
			plate: form.plate.trim(),
			serial: form.serial.trim(),
			start_date: persianYMDToGregorian(form.start_date.trim()),
			ownership: form.ownership.trim(),
			status: form.status ? 1 : 0,
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
			const response = await fetch("/api/machinery/add", {
				method: "POST",
				body: JSON.stringify(buildPayload(addForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن ماشین‌آلات");
				return;
			}

			toast.success("ماشین‌آلات اضافه شد");
			setAddDrawerOpen(false);
			fetchMachinery();
		} catch (error) {
			console.error("Error adding machinery:", error);
			toast.error("خطا در افزودن ماشین‌آلات");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(item: MachineryListItem) {
		setEditingId(item.MachineryID);
		const year = getYear(item);
		setEditForm({
			type_id: item.TypeID ?? null,
			year: year !== undefined ? String(year) : "",
			plate: getPlate(item),
			serial: getSerial(item),
			start_date: gregorianYMDToPersian(toGregorianYMD(getStartDate(item))),
			ownership: getOwnership(item),
			status: statusToBool(getStatus(item)),
			description: getDescription(item),
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editingId === null) return;
		if (!validateForm(editForm)) return;
		try {
			setEditSaving(true);
			const response = await fetch(`/api/machinery/update/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(buildPayload(editForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش ماشین‌آلات");
				return;
			}

			toast.success("ماشین‌آلات بروزرسانی شد");
			setEditDrawerOpen(false);
			setEditingId(null);
			fetchMachinery();
		} catch (error) {
			console.error("Error editing machinery:", error);
			toast.error("خطا در ویرایش ماشین‌آلات");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch(`/api/machinery/delete/${deleteTarget.MachineryID}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف ماشین‌آلات");
				return;
			}

			toast.success("ماشین‌آلات حذف شد");
			setDeleteTarget(null);
			fetchMachinery();
		} catch (error) {
			console.error("Error deleting machinery:", error);
			toast.error("خطا در حذف ماشین‌آلات");
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	const renderTypeSelector = (
		form: MachineryForm,
		setForm: React.Dispatch<React.SetStateAction<MachineryForm>>
	) => (
		<div className="space-y-2">
			<span className="text-sm font-medium">نوع ماشین</span>
			{machineTypes.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{machineTypes.map((type) => {
						const active = form.type_id === type.TypeID;
						return (
							<button
								key={type.TypeID}
								type="button"
								onClick={() => setForm((prev) => ({ ...prev, type_id: type.TypeID }))}
								className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer
									${active
										? "bg-primary/10 text-primary border-primary/40"
										: "bg-background-light dark:bg-background-dark text-gray-500 border-gray-light dark:border-gray-dark"
									}`}
							>
								{machineTypeName(type)}
							</button>
						);
					})}
				</div>
			) : (
				<p className="text-xs text-gray-500">نوع ماشینی در دسترس نیست</p>
			)}
		</div>
	);

	const renderFormFields = (
		form: MachineryForm,
		setForm: React.Dispatch<React.SetStateAction<MachineryForm>>
	) => (
		<>
			<div className="space-y-1">
				{renderTypeSelector(form, setForm)}
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
			<CustomInput
				placeholder="پلاک"
				icon={<Card />}
				value={form.plate}
				setValue={(value) => setForm((prev) => ({ ...prev, plate: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="سریال"
				icon={<Hashtag />}
				value={form.serial}
				setValue={(value) => setForm((prev) => ({ ...prev, serial: value }))}
				handleAction={() => { }}
			/>
			<CustomInput
				placeholder="سال ساخت"
				icon={<Calendar />}
				value={form.year}
				setValue={(value) => setForm((prev) => ({ ...prev, year: value }))}
				handleAction={() => { }}
				type="number"
			/>
			<div className="space-y-1">
				<DatePicker
					calendar={persian}
					locale={persian_fa}
					format="YYYY-MM-DD"
					calendarPosition="bottom-right"
					value={form.start_date || ""}
					onChange={(date) => {
						const d = Array.isArray(date) ? date[0] : date;
						setForm((prev) => ({ ...prev, start_date: d ? d.format("YYYY-MM-DD") : "" }));
					}}
					containerClassName="w-full"
					inputClass="w-full rounded-full border border-gray-light dark:border-gray-dark bg-white dark:bg-background-dark px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
					placeholder="تاریخ شروع"
				/>
				<p className="text-xs mr-4 text-transparent">-</p>
			</div>
			<CustomInput
				placeholder="مالکیت"
				icon={<ClipboardList />}
				value={form.ownership}
				setValue={(value) => setForm((prev) => ({ ...prev, ownership: value }))}
				handleAction={() => { }}
			/>
			<CustomTextarea
				placeholder="توضیحات"
				value={form.description}
				setValue={(value) => setForm((prev) => ({ ...prev, description: value }))}
				handleAction={() => { }}
			/>
			<div className="space-y-1">
				<div className="flex items-center justify-between rounded-full border border-gray-light dark:border-gray-dark bg-white dark:bg-background-dark px-4 py-3">
					<div className="flex items-center gap-2 text-sm font-medium">
						<Tuning2 size={18} />
						<span>وضعیت {form.status ? "(فعال)" : "(غیرفعال)"}</span>
					</div>
					<CustomSwitch
						checked={form.status}
						onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.checked }))}
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
							title="افزودن ماشین‌آلات"
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
							{machinery.length > 0 ? (
								machinery.map((item) => (
									<tr
										className="hover:bg-primary/10 hover:rounded-full transition-colors group"
										key={item.MachineryID}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
													<WheelAngle size={16} className="text-primary" />
												</div>
												<div className="text-sm font-medium">{rowTypeName(item) || "-"}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getPlate(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getSerial(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">
											{getYear(item) !== undefined ? getYear(item) : "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getOwnership(item) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">
											{getStatus(item) !== undefined && getStatus(item) !== "" ? (
												<span
													className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusToBool(getStatus(item))
														? "bg-green-400/10 text-green-600"
														: "bg-gray-400/10 text-gray-500"
														}`}
												>
													{statusToBool(getStatus(item)) ? "فعال" : "غیرفعال"}
												</span>
											) : (
												"-"
											)}
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
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ ماشین‌آلاتی یافت نشد</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">هنوز ماشین‌آلاتی در سیستم ثبت نشده است</p>
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
						<h2 className="text-xl font-semibold">افزودن ماشین‌آلات</h2>
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
						<h2 className="text-xl font-semibold">ویرایش ماشین‌آلات</h2>
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
				title="حذف ماشین‌آلات"
				message={`آیا از حذف این ماشین‌آلات مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
