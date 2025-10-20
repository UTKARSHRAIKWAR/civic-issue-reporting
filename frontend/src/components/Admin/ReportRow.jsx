export const StatusBadge = ({ status }) => {
  const statusClasses = {
    Pending:
      "bg-neutral/20 text-neutral-800 dark:bg-neutral/30 dark:text-neutral-200",
    "In Progress":
      "bg-warning/20 text-yellow-800 dark:bg-warning/30 dark:text-yellow-200",
    Resolved:
      "bg-success/20 text-green-800 dark:bg-success/30 dark:text-green-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusClasses[status] || ""
      }`}
    >
      {status}
    </span>
  );
};

export const ReportRow = ({ report }) => (
  <tr className="bg-white dark:bg-slate-900/70 border-b dark:border-slate-800 last:border-b-0">
    <th
      scope="row"
      className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap"
    >
      {report.title}
    </th>
    <td className="px-6 py-4">{report?.location?.name}</td>
    <td className="px-6 py-4">
      {new Date(report?.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4">
      <StatusBadge status={report?.status} />
    </td>
    <td className="px-6 py-4">{report.department}</td>
    <td className="px-6 py-4 flex gap-2">
      {/* View Issue */}
      <a
        href={`/admin-dashboard/issues/${report._id}`}
        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined text-lg">visibility</span>
      </a>

      {/* Assign */}
      <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
        <span className="material-symbols-outlined text-lg">
          assignment_ind
        </span>
      </button>

      {/* Publish Changes */}
      <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
        <span className="material-symbols-outlined text-lg">
          published_with_changes
        </span>
      </button>
    </td>
  </tr>
);
