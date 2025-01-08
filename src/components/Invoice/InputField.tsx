// Input.tsx
import React, { ChangeEvent } from 'react';

interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: 'text' | 'textarea' | 'date' | 'number';
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
}

const InputField: React.FC<InputProps> = ({
                                              label,
                                              name,
                                              value,
                                              onChange,
                                              placeholder,
                                              type = 'text',
                                              rows = 3,
                                              className,
                                              style,
                                          }) => {
    return (
        <div className={ `mb-4 ${ className }` } style={ style }>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ label }</label>
            { type === 'textarea' ? (
                <textarea
                    name={ name }
                    value={ value }
                    onChange={ onChange }
                    placeholder={ placeholder }
                    rows={ rows }
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    style={ { resize: 'none' } }
                />
            ) : (
                <input
                    type={ type }
                    name={ name }
                    value={ value }
                    onChange={ onChange }
                    placeholder={ placeholder }
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            ) }
        </div>
    );
};

export default InputField;