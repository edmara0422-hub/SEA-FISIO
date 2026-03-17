// Shown instantly while the explore page JS loads — prevents black screen flash
export default function ExploreLoading() {
  return (
    <div className="relative min-h-screen bg-[#020202]">
      <div className="relative z-10 px-4 pb-36 pt-8 md:px-8 md:pt-12">
        <div className="mx-auto max-w-2xl space-y-10">
          {/* Clock skeleton */}
          <div className="h-11 w-full rounded-[1.85rem] bg-white/4 animate-pulse" />
          {/* Carousel skeleton */}
          <div
            className="w-full rounded-[2rem] bg-white/3 animate-pulse"
            style={{ height: 'clamp(340px, 58vh, 520px)' }}
          />
        </div>
      </div>
    </div>
  )
}
