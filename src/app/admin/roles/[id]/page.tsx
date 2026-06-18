"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
	CheckCircle,
	ShieldKeyhole,
	ShieldUser,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import TableShimmer from "@/components/shimmers/TableShimmer";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import toast from "react-hot-toast";

import { RoleItemType } from "@/lib/schemas/role-list.schema";
import { PermissionItemType } from "@/lib/schemas/permission-list.schema";

const columnHeads = [
	{ id: "select", name: "", percent: 10, textRight: false, sortable: false },
	{ id: "name", name: "نام دسترسی", percent: 45, textRight: false, sortable: false },
	{ id: "key", name: "کلید دسترسی", percent: 45, textRight: false, sortable: false },
];

export default function RoleDetails() {
	const params = useParams();
	const roleId = Number(Array.isArray(params.id) ? params.id[0] : params.id ?? 0);

	const [role, setRole] = useState<RoleItemType | null>(null);
	const [permissions, setPermissions] = useState<Array<PermissionItemType>>([]);
	const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);

			const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
				fetch("/api/roles"),
				fetch("/api/permissions"),
				fetch("/api/role-permissions/get", {
					method: "POST",
					body: JSON.stringify({ RoleID: roleId }),
				}),
			]);

			if (!permissionsRes.ok || !rolePermissionsRes.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const permissionsResult = await permissionsRes.json();
			const rolePermissionsResult = await rolePermissionsRes.json();
			setPermissions(permissionsResult?.list ?? []);
			setSelectedPermissionIds(new Set<number>(rolePermissionsResult?.PermissionIDs ?? []));

			if (rolesRes.ok) {
				const rolesResult = await rolesRes.json();
				const found = (rolesResult?.list ?? []).find(
					(item: RoleItemType) => String(item.RoleID) === String(roleId)
				);
				if (found) {
					setRole(found);
					useBreadcrumbStore.getState().setName(found.RoleName);
				}
			}
		} catch (error) {
			console.error("Error fetching role details:", error);
			toast.error("خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	}, [roleId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	function togglePermission(id: number) {
		setSelectedPermissionIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	async function savePermissions() {
		try {
			setSaving(true);
			const response = await fetch("/api/role-permissions/set", {
				method: "POST",
				body: JSON.stringify({
					RoleID: roleId,
					PermissionIDs: Array.from(selectedPermissionIds),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ذخیره دسترسی‌ها");
				return;
			}

			toast.success("دسترسی‌های نقش ذخیره شد");
		} catch (error) {
			console.error("Error saving role permissions:", error);
			toast.error("خطا در ذخیره دسترسی‌ها");
		} finally {
			setSaving(false);
		}
	}

	const selectedCount = useMemo(() => selectedPermissionIds.size, [selectedPermissionIds]);

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	return (
		<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
			{/* Role Info */}
			<div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-light dark:border-gray-dark">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
						<ShieldUser size={24} className="text-primary" />
					</div>
					<div>
						<div className="text-lg font-semibold">{role?.RoleName || roleId}</div>
						<div className="text-sm text-gray-500">{role?.RoleDescription || "-"}</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500">{selectedCount} دسترسی انتخاب شده</span>
					<CustomButton
						onClick={savePermissions}
						title="ذخیره دسترسی‌ها"
						loading={saving}
						icon={<CheckCircle size={18} />}
					/>
				</div>
			</div>

			{/* Permissions Table */}
			<div className="overflow-x-auto px-4 pt-4">
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
									<div className="flex items-center gap-2 justify-center">{head.name}</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-light dark:divide-gray-dark">
						{permissions.length > 0 ? (
							permissions.map((permission) => {
								const checked = selectedPermissionIds.has(permission.PermissionID);
								return (
									<tr
										className={`hover:bg-primary/10 hover:rounded-full transition-colors cursor-pointer ${checked ? "bg-primary/5" : ""}`}
										key={permission.PermissionID}
										onClick={() => togglePermission(permission.PermissionID)}
									>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<input
												type="checkbox"
												checked={checked}
												onChange={() => togglePermission(permission.PermissionID)}
												onClick={(e) => e.stopPropagation()}
												className="w-5 h-5 accent-primary cursor-pointer"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<div className="flex items-center justify-center gap-2">
												<ShieldKeyhole size={18} className="text-primary" />
												<span className="text-sm font-medium">{permission.PermissionName}</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary font-mono" dir="ltr">
												{permission.PermissionKey}
											</span>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={columnHeads.length} className="px-6 py-12 text-center">
									<div className="flex flex-col items-center justify-center">
										<div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
											<ShieldKeyhole className="w-8 h-8 text-gray-400 dark:text-gray-500" />
										</div>
										<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ دسترسی‌ای یافت نشد</h3>
										<p className="text-gray-500 dark:text-gray-400 text-sm">ابتدا دسترسی‌ها را در صفحه دسترسی‌ها تعریف کنید</p>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
