"use client";

import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  as?: "h1" | "p" | "span";
}

export function EditableText({
  value,
  onChange,
  className = "",
  inputClassName = "",
  as: Tag = "span",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            setIsEditing(false);
          }
        }}
        className={`bg-transparent outline-none border-none ${inputClassName}`}
        style={{ width: `${Math.max(value.length, 3)}ch` }}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`cursor-text relative inline-flex items-center gap-1.5 transition-all duration-150 ${className}`}
    >
      <span
        className={`transition-all duration-150 ${
          isHovering
            ? "border-b border-dashed border-claude/40"
            : "border-b border-transparent"
        }`}
      >
        {value}
      </span>
      <PencilIcon
        className={`w-3 h-3 text-claude/50 transition-all duration-150 ${
          isHovering ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
        }`}
      />
    </Tag>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
