import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
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
        formData
      );

      alert(response.data.message);

      setUploadedFiles(response.data.files);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center p-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[600px]">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Document Upload Dashboard
        </h1>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-6 w-full border p-3 rounded-lg"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Uploaded Files
          </h2>

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