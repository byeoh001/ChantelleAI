import React, { useEffect, useState } from "react";

type Segment = {
  text: string;
  className?: string;
};

type TypingEffectProps = {
  segments: Segment[];
  speed?: number;
  pause?: number;
};

const TypingEffect: React.FC<TypingEffectProps> = ({
  segments,
  speed = 70,
  pause = 700,
}) => {
  const fullText = segments.map((seg) => seg.text).join("");
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedLength < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedLength(displayedLength + 1);
      }, speed);
    } else if (isDeleting && displayedLength > 0) {
      timeout = setTimeout(() => {
        setDisplayedLength(displayedLength - 1);
      }, speed / 2);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(!isDeleting);
      }, pause);
    }

    return () => clearTimeout(timeout);
  }, [displayedLength, isDeleting, fullText, speed, pause]);

  // Render only characters that have been "typed"
  const renderText = () => {
    let remaining = displayedLength;
    return segments.map((seg, i) => {
      if (remaining <= 0) return null;
      const textToShow = seg.text.slice(0, remaining);
      remaining -= textToShow.length;
      return (
        <span key={i} className={seg.className}>
          {textToShow}
        </span>
      );
    });
  };

  return <span className="typing-cursor">{renderText()}</span>;
};

export default TypingEffect;