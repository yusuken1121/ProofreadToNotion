"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessEnglishWord } from "@/types/BusinessEnglish.Type";
import { Pencil, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardProps {
  word: BusinessEnglishWord;
  onEdit: (word: BusinessEnglishWord) => void;
  onDelete: (wordId: string) => void;
  isReverseMode?: boolean;
}

const Flashcard = ({
  word,
  onEdit,
  onDelete,
  isReverseMode = false,
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Stop propagation if the click is on a button to prevent flipping
    if ((e.target as HTMLElement).closest("button")) {
      e.stopPropagation();
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word.english);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const frontText = isReverseMode ? word.english : word.japanese;
  const backText = isReverseMode ? word.japanese : word.english;
  const showAudioOnFront = isReverseMode;

  return (
    <div className="relative perspective-1000 group">
      <div
        className={`transform-style-3d transition-transform duration-500 w-full h-48 cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
        onClick={handleCardClick}
      >
        {/* Card Front */}
        <Card className="absolute w-full h-full backface-hidden flex items-center justify-center">
          <CardContent className="p-6 flex flex-col items-center gap-2">
            <p className="text-xl font-semibold text-center">{frontText}</p>
            {showAudioOnFront && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Card Back */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <CardContent className="p-6 flex flex-col items-center gap-2">
            <p className="text-xl font-medium text-center">{backText}</p>
            {!showAudioOnFront && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="outline" size="icon" onClick={() => onEdit(word)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(word.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;
