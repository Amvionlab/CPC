import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AiOutlineUpload } from 'react-icons/ai';
const AssetDocuments = () => {
  const { tag } = useParams();
  const [files, setFiles] = useState([]);
  const decodedTag = decodeURIComponent(tag);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [decodedTag]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/backend/fetchDocuments.php?action=fetch&tag=${decodedTag}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setFiles([]);
      } else {
        setFiles(data);
      }
    } catch (err) {
      setError('Error fetching files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (fileInput) {
      formData.append('userfile', fileInput);
      formData.append('tag', decodedTag);

      try {
        const response = await fetch(`${baseURL}/backend/fetchDocuments.php?action=upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        const result = await response.json();
        if (result.success) {
          await fetchFiles();
          setShowModal(false);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Error uploading file');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className='-ml-3 -mr-3 pr-7 pl-7 overflow-hidden'>
        <div className="flex font-bold justify-between items-center mb-2 p-2">
        <h1 className="text-lg ">Asset Documents</h1>
        <button className="flex text-xs items-center px-3 py-1 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
         onClick={() => setShowModal(true)}>
  <AiOutlineUpload  className="w-3 h-3 mr-2 font-bold"  />
  Add Files
</button>

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {files.map((file) => (
          <div key={file.id} className="rounded-lg shadow-sm  border bg-box ">
            <div className="p-2 mb-2">
              <div className="flex justify-between space-x-2 mt-1 text-xs text-prime font-bold">
                <h1 className='text-flo'>{file.name}</h1>
                <h1>{file.post_date}</h1>
                <div className='flex'>
                <a
                  href={`/asset_doc_download.php?file=${file.path}&filename=${file.attachmentname}`}
                  className="bg-box  mr-2 text-green-500 border px-1 py-1 text-xs rounded flex items-center space-x-1 hover:bg-second"
                >
                  <FaDownload className="w-3 h-3" />
                </a>
                <button
                  className="bg-box text-red-500 border px-1 py-1 text-xs rounded-md flex items-center space-x-1 hover:bg-second"
                  onClick={() => deleteAssetFile(file.attachment_id)}
                >
                  <FaTrash className="w-3 h-3 " />
                </button>
               
                </div>
              </div>
            </div>
            <div className="flex justify-center rounded-lg bg-box">
              <img
                src={`${baseURL}/${file.path}`}
                alt={file.attachmentname}
                className="h-44 border w-auto hover:z-10 rounded-lg transition-transform transform hover:scale-125"
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded lg:w-1/3 md:w-1/2 w-full p-8">
            <h5 className="text-lg font-bold mb-4">Upload File</h5>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <input
                  type="file"
                  onChange={(e) => setFileInput(e.target.files[0])}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock for the delete function
const deleteAssetFile = (attachmentId) => {
  console.log('Deleting file with ID:', attachmentId);
};

export default AssetDocuments;
