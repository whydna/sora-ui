import { useDropzone } from 'react-dropzone';

type ImageSelectProps = {
  value: string;
  onChange: (path: string) => void;
};

const ImageSelect = ({ value, onChange }: ImageSelectProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0] as File & { path: string };
    if (file?.path) {
      onChange(file.path);
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
      {value ? (
        <img
          src={`file://${value}`}
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

