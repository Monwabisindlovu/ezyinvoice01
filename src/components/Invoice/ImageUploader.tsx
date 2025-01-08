import React, { ChangeEvent, DragEvent, useState } from 'react';

interface ImageUploaderProps {
    label: string;
    image: string | null;
    onChange: (file: File | null) => void;
    className?: string;
    style?: React.CSSProperties;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onChange, className, style }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
        const file = event.dataTransfer.files?.[0] || null;
        onChange(file);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <div className={ className } style={ style }>
            <label className="block text-sm font-medium text-gray-700">{ label }</label>
            <div
                className={ `border-2 border-dashed rounded-md p-4 text-center mb-4 ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }` }
                onDrop={ handleDrop }
                onDragOver={ handleDragOver }
                onDragLeave={ handleDragLeave }
            >
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={ handleFileChange }
                    className="hidden"
                    id={ `file-input-${ label }` }
                />
                <label htmlFor={ `file-input-${ label }` } className="cursor-pointer">
                    <p className="mt-2 text-gray-500">
                        Drag and drop a PNG or JPEG file or <span className="text-blue-500 underline">click to select one</span>.
                    </p>
                </label>
            </div>
            { image && (
                <img
                    src={ image }
                    alt={ label }
                    style={ { width: '100px', height: '50px', marginTop: '10px', objectFit: 'contain' } }
                />
            ) }
        </div>
    );
};

export default ImageUploader;