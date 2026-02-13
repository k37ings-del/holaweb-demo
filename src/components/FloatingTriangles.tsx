const FloatingTriangles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Triangle 1 — large, top-right area */}
      <div
        className="absolute"
        style={{
          top: "12%",
          right: "8%",
          width: "380px",
          height: "380px",
          transform: "rotate(15deg)",
          filter: "blur(1.5px)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "190px solid transparent",
            borderRight: "190px solid transparent",
            borderBottom: "330px solid hsla(205, 55%, 18%, 0.12)",
            filter: "drop-shadow(0 25px 50px hsla(205, 55%, 8%, 0.4))",
          }}
        />
      </div>

      {/* Triangle 2 — large, bottom-left area */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "5%",
          width: "320px",
          height: "320px",
          transform: "rotate(-25deg)",
          filter: "blur(2px)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "160px solid transparent",
            borderRight: "160px solid transparent",
            borderBottom: "280px solid hsla(352, 66%, 47%, 0.06)",
            filter: "drop-shadow(0 30px 60px hsla(352, 66%, 30%, 0.25))",
          }}
        />
      </div>
    </div>
  );
};

export default FloatingTriangles;
