"use client";

interface TaskCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  completed?: boolean;
}

export function TaskCard({ title, description, children, completed }: TaskCardProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
        {completed && (
          <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
            Done
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>
      {children}
    </div>
  );
}
