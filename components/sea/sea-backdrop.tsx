export function SeaBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#020202]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025)_0%,rgba(2,2,2,0)_18%,rgba(0,0,0,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.03),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(199,203,210,0.04),transparent_30%)]" />
      <div className="absolute left-1/2 top-0 h-[22rem] w-[min(68rem,94vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(214,220,228,0.015)_48%,transparent_78%)] blur-3xl" />
      <div className="absolute left-[10%] top-[16%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute right-[10%] top-[20%] h-[20rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(176,184,193,0.03)_0%,transparent_72%)] blur-[120px]" />
      <div className="absolute inset-x-[14%] bottom-[-12rem] h-[18rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,219,227,0.05)_0%,rgba(213,219,227,0.015)_42%,transparent_72%)] blur-[110px]" />
    </div>
  )
}
