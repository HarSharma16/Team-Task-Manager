import { FolderKanban } from "lucide-react";

const AuthShell = ({ children, title, subtitle, backgroundImage }) => (
  <div className="relative min-h-screen overflow-hidden">
    {/* Background Image Layer */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backgroundImage
          ? `url("${backgroundImage}")`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    />
    {/* Blur Overlay */}
    <div className="absolute inset-0 bg-slate-950/0 backdrop-blur-sm" />

    {/* Content Layer */}
    <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-950/20 sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-600 text-white">
            <FolderKanban className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Team Task Manager</p>
            <p className="text-sm text-white/80">Collaborative project control</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-white/90">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  </div>
);

export default AuthShell;
