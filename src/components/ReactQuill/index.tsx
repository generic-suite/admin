import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuillEditor = ({ defaultValue, onChange }) => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (defaultValue !== editorContent) {
      setEditorContent(defaultValue);
    }
  }, [defaultValue, editorContent]);


  // 处理富文本编辑器内容变化
  const handleEditorChange = (content) => {
    setEditorContent(content);
    // 将内容传递给父组件
    onChange(content);
  };


  return (
    <ReactQuill
      theme="snow"
      value={editorContent}
      onChange={handleEditorChange}
    />
  );
};

export default ReactQuillEditor;

