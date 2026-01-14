import { create } from "zustand";

export interface CardData {
  id: string;
  label: string;
  image: string | null;
}

interface CardsState {
  title: string;
  subtitle: string;
  cards: CardData[];
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  updateLabel: (id: string, label: string) => void;
  updateImage: (id: string, image: string | null) => void;
}

const initialCards: CardData[] = [
  { id: "1", label: "CEO", image: null },
  { id: "2", label: "CTO", image: null },
  { id: "3", label: "CFO", image: null },
  { id: "4", label: "COO", image: null },
  { id: "5", label: "CIO", image: null },
  { id: "6", label: "CMO", image: null },
];

export const useCardsStore = create<CardsState>((set) => ({
  title: "Claude en pañales",
  subtitle: "guía de 0 1 para entender y usar claude para que tu equipo se vea así:",
  cards: initialCards,
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  updateLabel: (id, label) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, label } : card
      ),
    })),
  updateImage: (id, image) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, image } : card
      ),
    })),
}));
