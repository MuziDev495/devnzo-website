import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
    question: string;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-[#1e204f]">{question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="text-gray-600 leading-relaxed">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
