import { useState } from "react";
import { CuratorPuzzleGate } from "@/components/CuratorPuzzleGate";
import { OmEditorShell } from "@/components/OmEditorShell";
import { useLocation } from "wouter";

export default function OmEditorPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [, setLocation] = useLocation();

  if (!unlocked) {
    return <CuratorPuzzleGate onUnlocked={() => setUnlocked(true)} />;
  }

  return <OmEditorShell onBack={() => setLocation("/om-dashboard")} />;
}
