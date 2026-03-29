// Static backdrop — uses CSS gradients only, zero blur filters
// blur-[120px] on multiple divs caused heavy GPU repaints on scroll
export function SeaBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden will-change-transform">
      <div className="absolute inset-0 bg-[#060606]" />
      {/* All light effects as pure CSS gradients — no filter:blur needed */}
      <div className="absolute inset-0" style={{
        background: [
          'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(2,2,2,0) 18%, rgba(0,0,0,0.42) 100%)',
          'radial-gradient(circle at 50% -12%, rgba(255,255,255,0.08), transparent 18%)',
          'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.055) 0%, transparent 38%)',
          'radial-gradient(circle at 16% 20%, rgba(255,255,255,0.025), transparent 30%)',
          'radial-gradient(circle at 84% 22%, rgba(199,203,210,0.03), transparent 32%)',
          'radial-gradient(ellipse at 50% 100%, rgba(213,219,227,0.04) 0%, transparent 52%)',
        ].join(', '),
      }} />
    </div>
  )
}
