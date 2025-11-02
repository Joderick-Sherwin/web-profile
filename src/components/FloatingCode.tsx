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
    "from keras.models import Sequential",
    "from keras.layers import Dense, Conv2D, Flatten, LSTM",
    "model.add(Dense(128, activation='relu'))",
    "model.compile(optimizer='sgd', loss='mse')",
    "from sklearn.model_selection import train_test_split",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)",
    "from sklearn.preprocessing import StandardScaler",
    "scaler = StandardScaler().fit(X_train)",
    "y_pred = model.predict(X_test)",
    "from sklearn.metrics import accuracy_score, confusion_matrix",
    "loss, accuracy = model.evaluate(X_test, y_test)",
    "import torch",
    "import torch.nn as nn",
    "import torch.optim as optim",
    "class NeuralNet(nn.Module):",
    "optimizer = optim.Adam(model.parameters(), lr=0.001)",
    "criterion = nn.CrossEntropyLoss()",
    "for epoch in range(epochs):",
    "outputs = model(inputs)",
    "loss = criterion(outputs, labels)",
    "from transformers import AutoModel, AutoTokenizer",
    "tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')",
    "inputs = tokenizer(text, return_tensors='pt')",
    "model = AutoModel.from_pretrained('bert-base-uncased')",
    "predicted_class = torch.argmax(outputs, dim=1)",
    "model.save('trained_model.h5')",
    "loaded_model = tf.keras.models.load_model('trained_model.h5')",
    "import numpy as np",
    "batch_x, batch_y = next(train_loader)",
    "for i, (inputs, labels) in enumerate(train_loader):",
  ];

  useEffect(() => {
    const createCodeLine = (): CodeLine => ({
      id: Math.random(),
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * 100,
      y: -10,
      speed: 0.05 + Math.random() * 0.1,
      opacity: 0.2 + Math.random() * 0.3,
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

        if (updated.length < 8 && Math.random() > 0.8) {
          updated.push(createCodeLine());
        }

        return updated;
      });
    }, 100);

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
