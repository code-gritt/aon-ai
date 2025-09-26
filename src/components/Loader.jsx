const Loader = ({ text = "LOADING..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <svg className="w-20 h-40">
          <circle
            id="s8"
            className="sMove t"
            cx="45"
            cy="50"
            r="45"
            fill="#020205"
          />
          <polygon
            id="s7"
            className="sMove t"
            points="45,05 16,16 1,42 6,73 30,92 60,92 84,73 89,42 74,16"
            fill="#230B09"
          />
          <polygon
            id="s6"
            className="sMove t"
            points="45,04 12,17 0,50 12,83 45,96 78,83 90,50 78,17"
            fill="#46130C"
          />
          <polygon
            id="s5"
            className="sMove t"
            points="45,04 9,22 1,60 25,92 65,92 89,60 81,22"
            fill="#631B0E"
          />
          <polygon
            id="s4"
            className="sMove t"
            points="45,03 4,26 4,74 45,97 86,74 86,26"
            fill="#812211"
          />
          <polygon
            id="s3"
            className="sMove t"
            points="45,03 1,35 18,88 72,88 89,35"
            fill="#992813"
          />
          <rect
            id="s2"
            className="sMove t"
            x="10"
            y="15"
            width="70"
            height="70"
            fill="#BD3116"
          />
          <polygon
            id="s1"
            className="sMove t"
            points="45,05 2,80 88,80"
            fill="#E43A19"
          />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-[#111F4D] animate-pulse">
          {text}
        </h1>
      </div>

      {/* Animations */}
      <style jsx>{`
        .t {
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
        }
        #s1 {
          animation-delay: -4s;
        }
        #s2 {
          animation-delay: -3.5s;
        }
        #s3 {
          animation-delay: -3s;
        }
        #s4 {
          animation-delay: -2.5s;
        }
        #s5 {
          animation-delay: -2s;
        }
        #s6 {
          animation-delay: -1.5s;
        }
        #s7 {
          animation-delay: -1s;
        }
        #s8 {
          animation-delay: -0.5s;
        }
        .sMove {
          animation: s-turn 8s linear infinite forwards;
        }
        @keyframes s-turn {
          50% {
            transform: rotateX(1turn);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
