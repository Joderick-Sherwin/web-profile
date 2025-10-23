import { useEffect, useState } from "react";

interface CodeLine {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

const FloatingCode = () => {
  const [codeLines, setCodeLines] = useState<CodeLine[]>([]);

  const codeSnippets = [
    "model.fit(X_train, y_train)",
    "import tensorflow as tf",
    "neural_network.predict()",
    "def train_model():",
    "accuracy: 98.5%",
    "epochs=100, batch=32",
    "optimizer='adam'",
    "loss='categorical_crossentropy'",
    "from sklearn import svm",
    "model.evaluate(X_test)",
  ];

  useEffect(() => {
    const createCodeLine = (): CodeLine => ({
      id: Math.random(),
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * 100,
      y: -10,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.3 + Math.random() * 0.4,
    });

    const initialLines = Array.from({ length: 8 }, createCodeLine);
    setCodeLines(initialLines);

    const interval = setInterval(() => {
      setCodeLines((prev) => {
        const updated = prev
          .map((line) => ({
            ...line,
            y: line.y + line.speed,
          }))
          .filter((line) => line.y < 110);

        if (updated.length < 8 && Math.random() > 0.7) {
          updated.push(createCodeLine());
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {codeLines.map((line) => (
        <div
          key={line.id}
          className="absolute font-mono text-xs text-primary"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            opacity: line.opacity,
            transform: "translateX(-50%)",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingCode;
