import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";

interface ShareData {
  title: string;
  subtitle: string;
  cards: unknown[];
}

interface ShareResult {
  id: string;
  url: string;
}

export function useShare() {
  return useMutation({
    mutationFn: async (data: ShareData): Promise<ShareResult> => {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to share");
      const { id } = await res.json();
      return { id, url: `${window.location.origin}/s/${id}` };
    },
  });
}

export function useOptimisticShare() {
  const mutation = useMutation({
    mutationFn: async (data: ShareData & { optimisticId: string }): Promise<ShareResult> => {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          id: data.optimisticId,
        }),
      });
      if (!res.ok) throw new Error("Failed to share");
      const { id } = await res.json();
      return { id, url: `${window.location.origin}/s/${id}` };
    },
  });

  const shareOptimistic = async (data: ShareData) => {
    const optimisticId = nanoid(10);
    const optimisticUrl = `${window.location.origin}/s/${optimisticId}`;
    
    await navigator.clipboard.writeText(optimisticUrl);
    
    mutation.mutate({ ...data, optimisticId });
    
    return { id: optimisticId, url: optimisticUrl };
  };

  return {
    ...mutation,
    shareOptimistic,
  };
}
