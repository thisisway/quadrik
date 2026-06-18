export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-grad-sea p-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/20 backdrop-blur-sm shadow-lg">
          <div className="h-10 w-10 rounded-full border-[6px] border-white" />
        </div>
        <h1 className="text-5xl font-black tracking-tight">Quadrik</h1>
        <p className="mt-4 text-xl font-light opacity-80">Sua arena no controle.</p>
        <p className="opacity-80">Sua comunidade em movimento.</p>

        <div className="mt-16 grid grid-cols-3 gap-4 opacity-60">
          {['Beach Tennis', 'Padel', 'Vôlei', 'Tênis'].map((sport) => (
            <span
              key={sport}
              className="rounded-full border border-white/30 px-3 py-1 text-xs text-center"
            >
              {sport}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-sand px-6 py-12">
        {children}
      </div>
    </div>
  )
}
