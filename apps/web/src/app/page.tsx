export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-grad-sun shadow-lg">
          <div className="relative h-12 w-12 rounded-full border-[8px] border-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-q-navy">Quadrik</h1>
        <p className="mt-3 text-lg text-gray">Bora jogar?</p>
      </div>
    </main>
  )
}
