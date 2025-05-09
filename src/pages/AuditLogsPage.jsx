import { useEffect, useState } from "react";
import api from "../api";
import {
	Copy,
	Download,
	ChevronLeft,
	ChevronRight,
	FileText,
	User,
	Trash2,
	ArrowUpRight,
	LogIn,
	Plus,
} from "lucide-react";
import { saveAs } from "file-saver";
import clsx from "clsx";

export default function AuditLogsPage() {
	const [logs, setLogs] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filters, setFilters] = useState({ action: "", entity: "", user: "" });
	const [search, setSearch] = useState("");
	const [officers, setOfficers] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchAuxData = async () => {
			const [officersRes, usersRes] = await Promise.all([
				api.get(`${import.meta.env.VITE_API_BASE_URL}/officers/mostrarOficiais`),
				api.get(`${import.meta.env.VITE_API_BASE_URL}/users/listarUsuarios`),
			]);
			setOfficers(officersRes.data);
			setUsers(usersRes.data);
		};
		fetchAuxData();
	}, []);

	useEffect(() => {
		let isCancelled = false;

		const fetchLogs = async () => {
			try {
				const params = { page, limit: 10, ...filters, search };
				const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/audit/audit-logs`, { params });
				if (isCancelled) return;

				const logs = res.data.results || res.data || [];

				const logsWithNames = logs.map((log) => {
					const user = users.find((u) => u._id === log.user?.id);
					const officer = officers.find((o) => o._id === log.user?.id);
					const targetUser = users.find((u) => u._id === log.target?.id);
					const targetOfficer = officers.find((o) => o._id === log.target?.id);
					const targetNameFromMetadata = log.metadata?.name || log.metadata?.officerName;

					return {
						...log,
						userDisplay: user?.officerName || officer?.name || "Desconhecido",
						targetDisplay: targetUser?.officerName || targetOfficer?.name || targetNameFromMetadata || log.target?.id || "-",
					};
				});

				setLogs(logsWithNames);
				setTotalPages(res.data.totalPages || 1);
			} catch (error) {
				setLogs([]);
			}
		};

		const debounceTimeout = setTimeout(() => {
			fetchLogs();
		}, 500);

		return () => {
			isCancelled = true;
			clearTimeout(debounceTimeout);
		};
	}, [search, page, filters, officers, users]);

	const copyLog = (log) => {
		navigator.clipboard.writeText(JSON.stringify(log, null, 2));
		alert("Log copiado!");
	};

	const exportToCSV = () => {
		if (!Array.isArray(logs)) return;
		const csv = logs.map((log) =>
			`"${new Date(log.timestamp).toLocaleString()}","${log.userDisplay}","${log.action}","${log.entity}","${log.targetDisplay}","${log.method}","${log.endpoint}"`
		);
		const header = `"Data","Usuário","Ação","Entidade","ID","Método","Endpoint"\n`;
		const blob = new Blob([header + csv.join("\n")], {
			type: "text/csv;charset=utf-8",
		});
		saveAs(blob, "audit_logs.csv");
	};

	const actionIcon = (action) => {
		const iconProps = { size: 16, className: "inline align-middle mr-1" };
		switch (action) {
			case "create": return <Plus {...iconProps} />;
			case "update": return <ArrowUpRight {...iconProps} />;
			case "delete": return <Trash2 {...iconProps} />;
			case "login": return <LogIn {...iconProps} />;
			case "promote": return <ArrowUpRight {...iconProps} />;
			default: return <FileText {...iconProps} />;
		}
	};

	return (
		<div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-200">
			<h1 className="text-3xl font-bold mb-6 tracking-tight dark:text-white">
				Logs de Auditoria
			</h1>

			<div className="flex flex-wrap gap-4 mb-6 items-center">
				<input
					type="text"
					placeholder="🔎 Buscar por termo..."
					className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm shadow-sm dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select
					className="border rounded-md px-4 py-2 text-sm shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
					value={filters.action}
				>
					<option value="">Todas as ações</option>
					<option value="create">Create</option>
					<option value="update">Update</option>
					<option value="delete">Delete</option>
					<option value="login">Login</option>
					<option value="promote">Promote</option>
				</select>
				<select
					className="border rounded-md px-4 py-2 text-sm shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					onChange={(e) => setFilters((f) => ({ ...f, entity: e.target.value }))}
					value={filters.entity}
				>
					<option value="">Todas as entidades</option>
					<option value="Officer">Officer</option>
					<option value="Evaluation">Evaluation</option>
					<option value="User">User</option>
				</select>
				<button
					onClick={exportToCSV}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center gap-2"
				>
					<Download size={16} /> Exportar CSV
				</button>
			</div>

			<div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow ring-1 ring-gray-100 dark:ring-gray-800">
				<table className="w-full table-auto text-sm text-left border-collapse">
					<thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
						<tr>
							<th className="p-3">Data</th>
							<th className="p-3">Usuário</th>
							<th className="p-3">Ação</th>
							<th className="p-3">Entidade</th>
							<th className="p-3">ID Alvo</th>
							<th className="p-3">Método</th>
							<th className="p-3">Endpoint</th>
							<th className="p-3 text-center">Ações</th>
						</tr>
					</thead>
					<tbody>
						{logs.length > 0 ? (
							logs.map((log) => (
								<tr key={log._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
									<td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
									<td className="p-3 flex items-center gap-2">
										<User size={16} className="text-gray-400" />
										{log.userDisplay}
									</td>
									<td className="p-3 font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">
										{actionIcon(log.action)} {log.action}
									</td>
									<td className="p-3">{log.target.entity}</td>
									<td className="p-3">{log.targetDisplay}</td>
									<td className="p-3">
										<span className={clsx(
											"inline-block px-2 py-1 text-xs font-semibold rounded",
											log.method === "POST" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
											log.method === "PUT" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
											log.method === "DELETE" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
											!["POST", "PUT", "DELETE"].includes(log.method) && "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
										)}>
											{log.method}
										</span>
									</td>
									<td className="p-3 text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs">
										{log.endpoint}
									</td>
									<td className="p-3 text-center">
										<button
											onClick={() => copyLog(log)}
											className="text-indigo-600 dark:text-indigo-400 text-xs hover:underline flex items-center gap-1 mx-auto"
										>
											<Copy size={14} /> Copiar
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="8" className="p-4 text-center text-gray-400 dark:text-gray-500">
									Nenhum log encontrado.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex justify-between items-center mt-6">
				<button
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
					disabled={page === 1}
				>
					<ChevronLeft size={16} /> Anterior
				</button>
				<span className="text-sm text-gray-600 dark:text-gray-300">
					Página {page} de {totalPages}
				</span>
				<button
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
					disabled={page === totalPages}
				>
					Próxima <ChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}
