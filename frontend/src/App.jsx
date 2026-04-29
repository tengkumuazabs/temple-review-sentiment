import { useState } from "react";
import axios from "axios";
import { History, ChevronDown, MapPin, Globe, Sparkles } from "lucide-react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatLabel = (label) => {
    if (!label) return "";
    const map = {
      positive: "Positive",
      negative: "Negative",
      neutral: "Neutral",
    };
    return map[label.toLowerCase()] || label;
  };

  const getBadgeStyle = (label) => {
    switch (label.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-700 border-green-200";
      case "negative":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(`${apiUrl}/predict`, {
        text,
      });

      const newItem = {
        text,
        label: res.data.label,  
        confidence: res.data.confidence,
      };

      setResult(res.data);
      setHistory([newItem, ...history]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("API error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-start justify-center px-4 py-10">

      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* 🛕 Header */}
        <div className="relative h-44">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Borobudur_Magelang.jpg"
            alt="Temple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h1 className="absolute bottom-4 left-5 text-white text-2xl font-bold">
            Temple Review Sentiment Analyzer
          </h1>
        </div>

        {/* About This App Section */}
        <div className="px-6 pt-6 pb-2">
          <div className="mb-6">
            <p className="text-gray-700 text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              About This App
            </p>
            
            <div className="flex gap-3 mb-3">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex-1">
                <p className="text-gray-700 text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Trained on Indonesian Temple Reviews</span>
                </p>
                <p className="text-gray-600 text-xs ml-6">
                  Reviews from Candi Borobudur and Prambanan temples
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex-1">
                <p className="text-gray-700 text-sm mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Multi-language Support</span>
                </p>
                <p className="text-gray-600 text-xs ml-6">
                  Analyzes reviews in Indonesian and English
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pt-2 pb-6">

          {/* Form Section */}
          <div className="lg:flex lg:flex-col lg:justify-start">

          {/* Input */}
          <textarea
            className="w-full border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 p-4 rounded-xl mb-4 outline-none transition"
            rows="4"
            placeholder="Write your temple review... Example: 'The temple is beautiful with amazing architecture!' (English) OR 'Candi ini luar biasa indah!' (Indonesian)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={analyze}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-5 text-center">
              <div
                className={`inline-block px-4 py-2 rounded-full border font-semibold ${getBadgeStyle(
                  result.label
                )}`}
              >
                {formatLabel(result.label)}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Confidence: {result.confidence.toFixed(4)}
              </p>
            </div>
          )}
          </div>

          {/* History Section */}
          <div className="flex flex-col">

            {history.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">

                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-xl bg-gray-50"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm text-gray-800 whitespace-pre-wrap break-words flex-1 ${
                        expandedIndex === index ? '' : 'line-clamp-2'
                      }`}>
                        {item.text}
                      </p>
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition"
                      >
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getBadgeStyle(
                          item.label
                        )}`}
                      >
                        {formatLabel(item.label)}
                      </span>

                      <span className="text-xs text-gray-500">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="text-center">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 font-medium">No reviews yet</p>
                  <p className="text-sm text-gray-400">Your inputted review history will be shown here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}