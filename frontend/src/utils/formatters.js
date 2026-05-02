export const getId = (entity) => entity?._id || entity?.id || "";

export const statusLabels = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done"
};

export const formatDate = (value) => {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

export const isOverdue = (task) => {
  if (!task?.dueDate || task.status === "done") {
    return false;
  }

  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);

  return due < new Date();
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TM";
