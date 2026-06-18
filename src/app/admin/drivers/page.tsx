"use client";

import { useCallback, useEffect, useState } from "react";
import {
	AddSquare,
	Card,
	PenNewRound,
	PhoneCallingRounded,
	TrashBinMinimalistic,
	UserRounded,
	UsersGroupTwoRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import TableShimmer from "@/components/shimmers/TableShimmer";
import toast from "react-hot-toast";

import { DriverItem, MachineTypeItem } from "@/lib/schemas/driver.schema";
import { MachineTypeListItem } from "@/lib/schemas/machine-type.schema";

function machineTypeName(item: MachineTypeListItem) {
	return item.MachineTypeName ?? item.name ?? item.Name ?? `#${item.TypeID}`;
}

export type ColumnHeadProps = {
	id: string;
	name: string;
	percent: number;
	textRight: boolean;
	sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
	{ id: "name", name: "نام راننده", percent: 22, textRight: false, sortable: false },
	{ id: "nationalCode", name: "کد ملی", percent: 16, textRight: false, sortable: false },
	{ id: "phone", name: "شماره تماس", percent: 16, textRight: false, sortable: false },
	{ id: "machineTypes", name: "نوع ماشین", percent: 26, textRight: false, sortable: false },
	{ id: "actions", name: "", percent: 10, textRight: false, sortable: false },
];

type DriverForm = {
	name: string;
	national_code: string;
	phone: string;
	description: string;
	machine_type_ids: Array<number>;
};

const emptyForm: DriverForm = {
	name: "",
	national_code: "",
	phone: "",
	description: "",
	machine_type_ids: [],
};

function getName(driver: DriverItem) {
	return driver.DriverName ?? driver.name ?? "";
}
function getNationalCode(driver: DriverItem) {
	return driver.national_code ?? driver.NationalCode ?? "";
}
function getPhone(driver: DriverItem) {
	return driver.phone ?? driver.Phone ?? "";
}
function getDescription(driver: DriverItem) {
	return driver.description ?? driver.Description ?? "";
}


export default function AdminDrivers() {
	const [drivers, setDrivers] = useState<Array<DriverItem>>([]);
	const [machineTypes, setMachineTypes] = useState<Array<MachineTypeItem>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [addDrawerOpen, setAddDrawerOpen] = useState(false);
	const [addSaving, setAddSaving] = useState(false);
	const [addForm, setAddForm] = useState<DriverForm>(emptyForm);

	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editForm, setEditForm] = useState<DriverForm>(emptyForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<DriverItem | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchDrivers = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/drivers/list");

			if (!response.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const result = await response.json();
			console.log("drivers list response:", result);
			setDrivers(Array.isArray(result) ? result : []);
		} catch (error) {
			console.error("Error fetching drivers data:", error);
			toast.error("خطا در دریافت اطلاعات راننده‌ها");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMachineTypes = useCallback(async () => {
		try {
			const response = await fetch("/api/machine-types/list");
			if (!response.ok) return;

			const result: Array<MachineTypeListItem> = await response.json();
			console.log("machine types list response:", result);
			setMachineTypes(
				(Array.isArray(result) ? result : []).map((item) => ({
					TypeID: item.TypeID,
					TypeName: machineTypeName(item),
				}))
			);
		} catch (error) {
			console.error("Error fetching machine types:", error);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchDrivers();
		fetchMachineTypes();
	}, [fetchDrivers, fetchMachineTypes]);

	function toggleFormType(
		setForm: React.Dispatch<React.SetStateAction<DriverForm>>,
		typeId: number
	) {
		setForm((prev) => {
			const exists = prev.machine_type_ids.includes(typeId);
			return {
				...prev,
				machine_type_ids: exists
					? prev.machine_type_ids.filter((id) => id !== typeId)
					: [...prev.machine_type_ids, typeId],
			};
		});
	}

	function validateForm(form: DriverForm) {
		if (form.name.trim().length < 2) {
			toast.error("نام راننده نامعتبر است");
			return false;
		}
		if (!form.national_code.trim()) {
			toast.error("کد ملی را وارد کنید");
			return false;
		}
		if (!form.phone.trim()) {
			toast.error("شماره تماس را وارد کنید");
			return false;
		}
		return true;
	}

	function buildPayload(form: DriverForm) {
		return {
			national_code: form.national_code.trim(),
			name: form.name.trim(),
			phone: form.phone.trim(),
			description: form.description.trim(),
			machine_type_ids: form.machine_type_ids,
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
			const response = await fetch("/api/drivers/add", {
				method: "POST",
				body: JSON.stringify(buildPayload(addForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در افزودن راننده");
				return;
			}

			toast.success("راننده اضافه شد");
			setAddDrawerOpen(false);
			fetchDrivers();
		} catch (error) {
			console.error("Error adding driver:", error);
			toast.error("خطا در افزودن راننده");
		} finally {
			setAddSaving(false);
		}
	}

	function openEditor(driver: DriverItem) {
		setEditingId(driver.DriverID);
		setEditForm({
			name: getName(driver),
			national_code: getNationalCode(driver),
			phone: getPhone(driver),
			description: getDescription(driver),
			machine_type_ids: driver.machine_types.map((type) => type.TypeID),
		});
		setEditDrawerOpen(true);
	}

	async function submitEdit() {
		if (editingId === null) return;
		if (!validateForm(editForm)) return;
		try {
			setEditSaving(true);
			const response = await fetch(`/api/drivers/update/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(buildPayload(editForm)),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ویرایش راننده");
				return;
			}

			toast.success("راننده بروزرسانی شد");
			setEditDrawerOpen(false);
			setEditingId(null);
			fetchDrivers();
		} catch (error) {
			console.error("Error editing driver:", error);
			toast.error("خطا در ویرایش راننده");
		} finally {
			setEditSaving(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			setDeleteLoading(true);
			const response = await fetch(`/api/drivers/delete/${deleteTarget.DriverID}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در حذف راننده");
				return;
			}

			toast.success("راننده حذف شد");
			setDeleteTarget(null);
			fetchDrivers();
		} catch (error) {
			console.error("Error deleting driver:", error);
			toast.error("خطا در حذف راننده");
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	const renderTypeSelector = (
		form: DriverForm,
		setForm: React.Dispatch<React.SetStateAction<DriverForm>>
	) => (
		<div className="space-y-2">
			<span className="text-sm font-medium">نوع ماشین</span>
			{machineTypes.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{machineTypes.map((type) => {
						const active = form.machine_type_ids.includes(type.TypeID);
						return (
							<button
								key={type.TypeID}
								type="button"
								onClick={() => toggleFormType(setForm, type.TypeID)}
								className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer
									${active
										? "bg-primary/10 text-primary border-primary/40"
										: "bg-background-light dark:bg-background-dark text-gray-500 border-gray-light dark:border-gray-dark"
									}`}
							>
								{type.TypeName}
							</button>
						);
					})}
				</div>
			) : (
				<p className="text-xs text-gray-500">نوع ماشینی در دسترس نیست</p>
			)}
		</div>
	);

	return (
		<>
			<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
				{/* Header */}
				<div className="p-6">
					<div className="flex justify-end">
						<CustomButton
							onClick={openAddDrawer}
							title="افزودن راننده"
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
							{drivers.length > 0 ? (
								drivers.map((driver) => (
									<tr
										className="hover:bg-primary/10 hover:rounded-full transition-colors group"
										key={driver.DriverID}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
													<span className="text-sm font-medium text-primary">{getName(driver).charAt(0)}</span>
												</div>
												<div className="text-sm font-medium">{getName(driver)}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getNationalCode(driver) || "-"}</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{getPhone(driver) || "-"}</td>
										<td className="px-6 py-4 text-center">
											<div className="flex flex-wrap gap-1 justify-center">
												{driver.machine_types.length > 0 ? (
													driver.machine_types.map((type) => (
														<span
															key={type.TypeID}
															className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
														>
															{type.TypeName}
														</span>
													))
												) : (
													<span className="text-sm text-gray-400">-</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<div className="flex items-center justify-center gap-2">
												<button
													className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
													onClick={() => openEditor(driver)}
													aria-label="ویرایش"
												>
													<PenNewRound size={16} />
												</button>
												<button
													className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-500 hover:bg-red-400/20 transition-colors cursor-pointer"
													onClick={() => setDeleteTarget(driver)}
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
												<UsersGroupTwoRounded className="w-8 h-8 text-gray-400 dark:text-gray-500" />
											</div>
											<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ راننده‌ای یافت نشد</h3>
											<p className="text-gray-500 dark:text-gray-400 text-sm">هنوز راننده‌ای در سیستم ثبت نشده است</p>
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
						<h2 className="text-xl font-semibold">افزودن راننده</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام راننده"
							icon={<UserRounded />}
							value={addForm.name}
							setValue={(value) => setAddForm((prev) => ({ ...prev, name: value }))}
							handleAction={() => { }}
						/>
						<CustomInput
							placeholder="کد ملی"
							icon={<Card />}
							value={addForm.national_code}
							maxLength={10}
							setValue={(value) => setAddForm((prev) => ({ ...prev, national_code: value }))}
							handleAction={() => { }}
							type="number"
						/>
						<CustomInput
							placeholder="شماره تماس"
							icon={<PhoneCallingRounded />}
							value={addForm.phone}
							maxLength={11}
							setValue={(value) => setAddForm((prev) => ({ ...prev, phone: value }))}
							handleAction={() => { }}
							type="number"
						/>
						<CustomTextarea
							placeholder="توضیحات"
							value={addForm.description}
							setValue={(value) => setAddForm((prev) => ({ ...prev, description: value }))}
							handleAction={() => { }}
						/>
						{renderTypeSelector(addForm, setAddForm)}
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
						<h2 className="text-xl font-semibold">ویرایش راننده</h2>
					</div>
					<div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
						<CustomInput
							placeholder="نام راننده"
							icon={<UserRounded />}
							value={editForm.name}
							setValue={(value) => setEditForm((prev) => ({ ...prev, name: value }))}
							handleAction={() => { }}
						/>
						<CustomInput
							placeholder="کد ملی"
							icon={<Card />}
							value={editForm.national_code}
							maxLength={10}
							setValue={(value) => setEditForm((prev) => ({ ...prev, national_code: value }))}
							handleAction={() => { }}
							type="number"
						/>
						<CustomInput
							placeholder="شماره تماس"
							icon={<PhoneCallingRounded />}
							value={editForm.phone}
							maxLength={11}
							setValue={(value) => setEditForm((prev) => ({ ...prev, phone: value }))}
							handleAction={() => { }}
							type="number"
						/>
						<CustomTextarea
							placeholder="توضیحات"
							value={editForm.description}
							setValue={(value) => setEditForm((prev) => ({ ...prev, description: value }))}
							handleAction={() => { }}
						/>
						{renderTypeSelector(editForm, setEditForm)}
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
				title="حذف راننده"
				message={`آیا از حذف «${deleteTarget ? getName(deleteTarget) : ""}» مطمئن هستید؟`}
				loading={deleteLoading}
			/>
		</>
	);
}
