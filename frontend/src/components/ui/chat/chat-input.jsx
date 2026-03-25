import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import { ArrowUp, Loader2, ChevronDown } from "lucide-react";

export const ChatInput = memo(({ 
  onSend, 
  isLoading = false, 
  placeholder = "Сообщение...",
  models = [],
  selectedModel = "",
  onModelChange,
  disabled = false,
  className = "" 
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const textareaRef = useRef(null);
  const modelSelectRef = useRef(null);
  
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  }, []);
  
  useEffect(() => {
    if (!value) {
      const textarea = textareaRef.current;
      if (textarea) textarea.style.height = 'auto';
    }
  }, [value]);
  
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    adjustHeight();
  }, [adjustHeight]);
  
  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setValue('');
      adjustHeight();
      
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [value, isLoading, disabled, onSend, adjustHeight]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setValue('');
      adjustHeight();
    }
  }, [handleSend, isComposing, adjustHeight]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelSelectRef.current && !modelSelectRef.current.contains(event.target)) {
        setIsModelOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, []);
  
  const handleModelSelect = useCallback((model) => {
    if (onModelChange) {
      onModelChange(model);
    }
    setIsModelOpen(false);
  }, [onModelChange]);
  
  return (
    <div className={`
      relative w-full
      ${className}
    `}>
      <div className="relative">
        <div className="flex items-end gap-3">
          {models.length > 0 && (
            <div className="relative" ref={modelSelectRef}>
              <button
                onClick={() => setIsModelOpen(!isModelOpen)}
                disabled={isLoading || disabled}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg
                  bg-gray-50 dark:bg-gray-800 
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  border border-gray-200 dark:border-gray-700
                  text-gray-700 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white
                  text-sm font-medium
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  whitespace-nowrap
                `}
              >
                <span className="max-w-[120px] truncate">
                  {selectedModel || "Выберите модель"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isModelOpen && (
                <div className="absolute bottom-full mb-2 left-0 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="py-1 max-h-[300px] overflow-y-auto">
                    {models.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => handleModelSelect(model.value)}
                        className={`
                          w-full px-4 py-2 text-left text-sm
                          hover:bg-gray-50 dark:hover:bg-gray-700 
                          transition-colors duration-150
                          ${selectedModel === model.value 
                            ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                            : 'text-gray-700 dark:text-gray-300'
                          }
                        `}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{model.label}</span>
                          {model.description && (
                            <span className="text-xs text-gray-500">{model.description}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 relative">
            <div className={`
              relative rounded-2xl border 
              bg-white dark:bg-gray-900
              transition-all duration-200
              ${isFocused 
                ? 'border-gray-400 dark:border-gray-800 ring-2 ring-gray-700' 
                : 'hover:border-gray-600'
              }
            `}>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                disabled={disabled || isLoading}
                placeholder={placeholder}
                rows={1}
                className={`
                  w-full min-h-[44px] max-h-[120px]
                  px-4 py-3
                  bg-transparent
                  text-gray-900 dark:text-gray-100
                  text-sm leading-relaxed
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  resize-none
                  focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{
                  scrollbarWidth: 'thin'
                }}
              />
              
              {!value && !isLoading && (
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-600 pointer-events-none">
                  <span className="hidden sm:inline">Shift + Enter ↵</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSend}
            disabled={isLoading || !value.trim() || disabled}
            className="
              w-10 h-10 rounded-full flex-shrink-0 mr-3
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-sm hover:shadow-md
            "
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-600 dark:text-gray-300 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
        
        .dark textarea::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        
        .dark textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
        
        textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .dark textarea {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
      `}
      </style>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';