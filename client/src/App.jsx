import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
              progressEvent.total
            );

            setProgress(percent);
          },
        }
      );

      setMessage("Files uploaded successfully");

      setUploadedFiles(response.data.files);

      setLoading(false);

      setProgress(0);
    } catch (error) {
      console.log(error);

      setLoading(false);

      setProgress(0);

      setMessage(
        error.response?.data?.message ||
        "Only PDF files are allowed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center p-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Document Upload Dashboard
        </h1>

        {message && (
          <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-lg text-center font-medium">
            {message}
          </div>
        )}

        <label className="border-2 border-dashed border-blue-400 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer mb-6 hover:bg-blue-50 transition">
          <p className="text-lg font-medium text-blue-600 mb-2">
            Drag & Drop PDF Files Here
          </p>

          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>

          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Choose PDFs
          </span>
        </label>

        {files.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Selected Files
            </h2>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {file.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  <span className="text-blue-600 text-sm">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

        {loading && (
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">
                Upload Progress
              </span>

              <span className="text-sm font-medium text-blue-600">
                {progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Uploaded Files
            </h2>

            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {uploadedFiles.length} Files
              </span>

              <button
                onClick={clearFiles}
                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500">
              No files uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {file.originalname}
                    </p>

                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>

                    <p className="text-sm text-gray-400">
                      Uploaded at: {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  <span className="text-green-600 font-semibold">
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;