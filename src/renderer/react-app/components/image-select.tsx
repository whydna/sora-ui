import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type ImageSelectProps = {
  value: string;
  onChange: (path: string) => void;
};

const ImageSelect = ({ value, onChange }: ImageSelectProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // value is an absolute path, so we need to create a file URL for it
    if (value) {
      setPreviewUrl(`local-file://${value}`);
      return;
    }
   
  }, [value]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const filePath = window.ipc.getPathForFile(file);
      onChange(filePath);
      setPreviewUrl(`local-file://${filePath}`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-32 h-20 rounded border cursor-pointer transition-colors ${
        isDragActive
          ? 'border-indigo-500 bg-indigo-500/10'
          : value
          ? 'border-zinc-600 hover:border-zinc-500'
          : 'border-zinc-600 border-dashed hover:border-zinc-500'
      }`}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Selected image"
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center px-2">
          {isDragActive ? 'Drop here' : 'Drop image or click'}
        </div>
      )}
    </div>
  );
};

export { ImageSelect };

