import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';

const AssetDocuments = () => {
    const { tag } = useParams();
    const [files, setFiles] = useState([]);
    const decodedTag = decodeURIComponent(tag);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fileInput, setFileInput] = useState(null); // To store file input for uploading

    useEffect(() => {
        fetchFiles();
    }, [decodedTag]); // Fetch files whenever decodedTag changes

    const fetchFiles = async () => {
        try {
            const response = await fetch(`${baseURL}/backend/fetchDocuments.php?action=fetch&tag=${decodedTag}`);
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
            formData.append('tag', decodedTag); // Send tag to the PHP script

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
                    await fetchFiles(); // Re-fetch the files after upload
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Error uploading file');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Asset Documents</h3>
            <button
                type="button"
                data-toggle="modal"
                data-target="#modal_file_upload"
            >
                Add Files
            </button>

            <div className="row">
                {files.map(file => (
                    <div key={file.id} className="">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">{file.attachmentname}</h3>
                                <div className="btn-group pull-right">
                                    <button className="btn btn-xs" onClick={() => deleteAssetFile(file.attachment_id)}>Delete</button>
                                    <a href={`/asset_doc_download.php?file=${file.path}&filename=${file.attachmentname}`}>
                                        <button className="btn btn-xs">Download</button>
                                    </a>
                                </div>
                            </div>
                            <div className="panel-body text-center">
                                <img
                                    src={`${baseURL}/${file.path}`}
                                    alt={file.attachmentname}
                                    style={{ height: '200px' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* File upload modal */}
            <div className="modal fade" id="modal_file_upload" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload File</h5>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFileUpload}>
                                <div className="form-group">
                                    <input
                                        type="file"
                                        onChange={e => setFileInput(e.target.files[0])}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Upload</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock for the delete function
const deleteAssetFile = (attachmentId) => {
    // Implement delete logic, e.g., call another API endpoint
    console.log("Deleting file with ID:", attachmentId);
};

export default AssetDocuments;
