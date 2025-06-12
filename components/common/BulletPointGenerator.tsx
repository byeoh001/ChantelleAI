"use client";

import React from "react";

const BulletGenerator = ({ targetId }: { targetId: string }) => {
  const handleBulletConversion = () => {
    const textarea = document.getElementById(targetId) as HTMLTextAreaElement;
    if (!textarea) return;
    const lines = textarea.value
      .split(/\r?\n/)
      .filter(line => line.trim())
      .map(line => `• ${line.trim()}`)
      .join("\n");
    textarea.value = lines;
  };

  return (
    <button
      type="button"
      onClick={handleBulletConversion}
      className="mt-0 text-sm text-blue-600 hover:underline"
    >
      • Generate Bullet 
    </button>
  );
};

export default BulletGenerator;
