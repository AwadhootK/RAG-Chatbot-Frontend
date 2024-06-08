import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import React, { useState } from 'react';

const FileUploadComponent: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total === undefined ? 1 : progressEvent.total));
                    setUploadProgress(percentCompleted);
                }
            },
        };

        try {
            await axios.post('http://localhost:8000/upload', formData, config);
            console.log('File uploaded successfully.');
            setFile(null);
            setUploadProgress(0);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Error uploading file:', axiosError.message);
            } else {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && (
                <p>Upload progress: {uploadProgress}%</p>
            )}
        </div>
    );
};

export default FileUploadComponent;
