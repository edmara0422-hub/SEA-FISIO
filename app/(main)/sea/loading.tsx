export default function SeaLoading() {
  return (
    <div className="relative min-h-screen bg-[#020202]">
      <div className="relative z-10 px-4 pb-32 pt-24 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-11 w-full rounded-[1.85rem] bg-white/4 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-[2rem] bg-white/3 animate-pulse" style={{ height: 'clamp(280px,44vw,400px)' }} />
            <div className="rounded-[2rem] bg-white/3 animate-pulse" style={{ height: 'clamp(220px,36vw,300px)' }} />
            <div className="rounded-[2rem] bg-white/3 animate-pulse" style={{ height: 'clamp(220px,36vw,300px)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
