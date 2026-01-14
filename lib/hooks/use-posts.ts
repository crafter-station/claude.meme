import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewPost, Post } from "@/lib/db/schema";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: NewPost): Promise<Post> => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData<Post[]>(["posts"], (old) => [
        ...(old ?? []),
        {
          ...newPost,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Post,
      ]);

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
