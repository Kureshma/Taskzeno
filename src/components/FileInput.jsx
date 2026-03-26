import { forwardRef, useState, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';

const FileInput = forwardRef(({ label, error, onChange, value, className = '', accept = "image/*" }, ref) => {
  const [preview, setPreview] = useState(value || null);

  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(value);
    } else if (!value) {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        if (onChange) {
          onChange(base64String);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      if (onChange) onChange(null);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setPreview(null);
    if (onChange) onChange(null);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      
      {!preview ? (
        <label className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors
          ${error ? 'border-red-400' : 'border-slate-300'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
            <p className="text-sm text-slate-500"><span className="font-semibold text-primary-600">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative w-full h-32 rounded-lg border border-slate-200 overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-full object-contain bg-slate-50" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

FileInput.displayName = 'FileInput';
export default FileInput;
