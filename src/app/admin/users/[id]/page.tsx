"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
	CheckCircle,
	PhoneCallingRounded,
	ShieldUser,
	UserRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import TableShimmer from "@/components/shimmers/TableShimmer";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import toast from "react-hot-toast";

import { RoleItemType } from "@/lib/schemas/role-list.schema";
import { UserItemType } from "@/lib/schemas/user-list.schema";

const columnHeads = [
	{ id: "select", name: "", percent: 10, textRight: false, sortable: false },
	{ id: "name", name: "نام نقش", percent: 40, textRight: false, sortable: false },
	{ id: "description", name: "توضیحات", percent: 50, textRight: false, sortable: false },
];

export default function UserDetails() {
	const params = useParams();
	const userId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

	const [user, setUser] = useState<UserItemType | null>(null);
	const [roles, setRoles] = useState<Array<RoleItemType>>([]);
	const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);

			const [usersRes, rolesRes, userRolesRes] = await Promise.all([
				fetch("/api/users"),
				fetch("/api/roles"),
				fetch("/api/user-roles/get", {
					method: "POST",
					body: JSON.stringify({ UserID: userId }),
				}),
			]);

			if (!rolesRes.ok || !userRolesRes.ok) {
				toast.error("خطا در دریافت اطلاعات");
				return;
			}

			const rolesResult = await rolesRes.json();
			const userRolesResult = await userRolesRes.json();
			setRoles(rolesResult?.list ?? []);
			setSelectedRoleIds(new Set<number>(userRolesResult?.RoleIDs ?? []));

			if (usersRes.ok) {
				const usersResult = await usersRes.json();
				const found = (usersResult?.list ?? []).find(
					(item: UserItemType) => String(item.UserID) === String(userId)
				);
				if (found) {
					setUser(found);
					useBreadcrumbStore.getState().setName(found.Name);
				}
			}
		} catch (error) {
			console.error("Error fetching user details:", error);
			toast.error("خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	function toggleRole(roleId: number) {
		setSelectedRoleIds((prev) => {
			const next = new Set(prev);
			if (next.has(roleId)) {
				next.delete(roleId);
			} else {
				next.add(roleId);
			}
			return next;
		});
	}

	async function saveRoles() {
		try {
			setSaving(true);
			const response = await fetch("/api/user-roles/set", {
				method: "POST",
				body: JSON.stringify({
					UserID: userId,
					RoleIDs: Array.from(selectedRoleIds),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				toast.error(result?.error || "خطا در ذخیره نقش‌ها");
				return;
			}

			toast.success("نقش‌های کاربر ذخیره شد");
		} catch (error) {
			console.error("Error saving user roles:", error);
			toast.error("خطا در ذخیره نقش‌ها");
		} finally {
			setSaving(false);
		}
	}

	const selectedCount = useMemo(() => selectedRoleIds.size, [selectedRoleIds]);

	if (loading) {
		return <TableShimmer columnHeads={columnHeads} />;
	}

	return (
		<section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
			{/* User Info */}
			<div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-light dark:border-gray-dark">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
						<UserRounded size={24} className="text-primary" />
					</div>
					<div>
						<div className="text-lg font-semibold">{user?.Name || userId}</div>
						<div className="flex items-center gap-1 text-sm text-gray-500">
							<PhoneCallingRounded size={14} />
							{user?.UserPhoneNumber || "-"}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500">{selectedCount} نقش انتخاب شده</span>
					<CustomButton
						onClick={saveRoles}
						title="ذخیره نقش‌ها"
						loading={saving}
						icon={<CheckCircle size={18} />}
					/>
				</div>
			</div>

			{/* Roles Table */}
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
						{roles.length > 0 ? (
							roles.map((role) => {
								const checked = selectedRoleIds.has(role.RoleID);
								return (
									<tr
										className={`hover:bg-primary/10 hover:rounded-full transition-colors cursor-pointer ${checked ? "bg-primary/5" : ""}`}
										key={role.RoleID}
										onClick={() => toggleRole(role.RoleID)}
									>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggleRole(role.RoleID)}
												onClick={(e) => e.stopPropagation()}
												className="w-5 h-5 accent-primary cursor-pointer"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<div className="flex items-center justify-center gap-2">
												<ShieldUser size={18} className="text-primary" />
												<span className="text-sm font-medium">{role.RoleName}</span>
											</div>
										</td>
										<td className="px-6 py-4 text-center text-sm">{role.RoleDescription || "-"}</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={columnHeads.length} className="px-6 py-12 text-center">
									<div className="flex flex-col items-center justify-center">
										<div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
											<ShieldUser className="w-8 h-8 text-gray-400 dark:text-gray-500" />
										</div>
										<h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">هیچ نقشی یافت نشد</h3>
										<p className="text-gray-500 dark:text-gray-400 text-sm">ابتدا نقش‌ها را در صفحه نقش‌ها تعریف کنید</p>
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
