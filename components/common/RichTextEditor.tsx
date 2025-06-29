"use client";

import React, { useEffect, useMemo, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({
  onRichTextEditorChange,
  defaultValue,
}: {
  onRichTextEditorChange: (value: any) => void;
  defaultValue: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  return (
    <QuillEditor
      theme="snow"
      value={value}
      modules={modules}
      onChange={(e: any) => {
          setValue(e);

          const plainText = e
            .replace(/<li>/g, '• ')
            .replace(/<\/li>/g, '\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<\/p><p>/g, '\n')
            .replace(/<[^>]+>/g, '')       // strip all remaining tags
            .replace(/&nbsp;/g, ' ')       // decode non-breaking spaces
            .replace(/•\s*/g, '\n• ')      // ensure each bullet is on new line
            .trim();

          onRichTextEditorChange(plainText);
        }}
      className="mt-2"
      style={{ borderColor: "#E5E7EB" }}
    />
  );
};

export default RichTextEditor;
