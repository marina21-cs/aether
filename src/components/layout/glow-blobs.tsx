export function GlowBlobs() {
  return (
    <>
      <div
        className="pointer-events-none fixed -left-[100px] -top-[200px] z-0 h-[600px] w-[600px] rounded-full opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -right-[100px] bottom-[20%] z-0 h-[400px] w-[400px] rounded-full opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
