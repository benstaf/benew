export function BuiltOnYCBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 bg-white/95 backdrop-blur-sm"
      style={{
        borderColor: '#F26522',
        boxShadow: '0 4px 12px rgba(242, 101, 34, 0.15)',
      }}
    >
      <span
        className="font-normal text-base"
        style={{
          fontFamily: '"DM Serif Display", serif',
          color: '#1a1a1a',
        }}
      >
        Built on
      </span>
      <div
        className="flex items-center justify-center w-6 h-6 rounded-sm text-white font-bold text-sm"
        style={{
          backgroundColor: '#F26522',
          fontFamily: '"Arimo", sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        Y
      </div>
      <span
        className="font-normal text-base"
        style={{
          fontFamily: '"DM Serif Display", serif',
          color: '#F26522',
        }}
      >
        Combinator
      </span>
    </div>
  );
}
