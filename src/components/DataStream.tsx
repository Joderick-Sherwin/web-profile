import { useEffect, useState } from "react";

const DataStream = () => {
  const [streams, setStreams] = useState<Array<{ id: number; left: string; delay: number }>>([]);

  useEffect(() => {
    const streamCount = 8;
    const newStreams = Array.from({ length: streamCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
    }));
    setStreams(newStreams);
  }, []);

  const binaryChars = "01";
  const generateBinaryString = () => {
    return Array.from({ length: 20 }, () => 
      binaryChars[Math.floor(Math.random() * binaryChars.length)]
    ).join("");
  };

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute top-0 text-primary font-mono text-xs"
          style={{
            left: stream.left,
            animation: `dataFall ${15 + stream.delay}s linear infinite`,
            animationDelay: `${stream.delay}s`,
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="mb-2 opacity-80">
              {generateBinaryString()}
            </div>
          ))}
        </div>
      ))}
      <style>{`
        @keyframes dataFall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DataStream;
