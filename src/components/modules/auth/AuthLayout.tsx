import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#f4f6fa] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#12345a] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-[5.8%]">
      <div className="pointer-events-none absolute -right-20 top-[10%] h-[340px] w-[340px] rounded-full border-[74px] border-white/[0.08]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-[310px] w-[310px] rounded-full border-[60px] border-white/[0.06]" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffcc19] text-lg font-black text-[#12345a]">D</span>
        <span className="leading-tight">
          <span className="block text-base font-extrabold tracking-wide">DIOKNO</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffcc19]">Volunteer Admin</span>
        </span>
      </div>

      <div className="relative z-10 max-w-[580px] py-14">
        <div className="mb-7 h-1 w-14 rounded-full bg-[#ffcc19]" />
        <h1 className="max-w-[560px] text-4xl font-bold leading-[1.14] tracking-[-0.04em] xl:text-[44px]">
          Volunteer management built for meaningful public service.
        </h1>
        <p className="mt-6 max-w-[470px] text-base leading-[1.85] text-blue-100/70">
          Coordinate communities, manage events, and turn collective action into measurable impact across the Philippines.
        </p>
      </div>

      <p className="relative z-10 text-xs font-medium text-blue-100/40">Diokno Volunteer Network • Secure administration portal</p>
    </aside>

    <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-12 xl:px-16">
      <div className="w-full max-w-[460px]">{children}</div>
    </main>
  </div>
);
