
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostService } from "@/services/postService";
import styles from "../app/posts/[id]/postDetail.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/a11y-light.css"; // Highlight.js style
import Image from 'next/image';
import ReactMarkdown from "react-markdown";
const PostDetailClient: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await PostService.getById(Number(id));
        setPost(data);
      } catch (err) {
        setError("Post detayları alınamadı. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      const codeBlocks = document.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [post]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.postDetailContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        Geri
      </button>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.postDate}>
        {new Date(post.createdDate).toLocaleDateString()}
      </p>
      <div className={styles.postContent}>
        {post.elements.map((element: any) =>
          element.contentType === "TEXT" ? (
            <div key={element.id} className={styles.postText}>
              <ReactMarkdown>{element.content}</ReactMarkdown>
            </div>
          ) : element.contentType === "IMAGE" && element.imageBase64 ? (
            <Image
              key={element.id}
              src={element.imageBase64}
              alt="Post Image"
              className={styles.postImage}
              width={200} 
              height={400} 
              unoptimized 
            />
          ) : element.contentType === "CODE" ? (
            <pre key={element.id} className={styles.postCode}>
              <code>{element.content}</code>
            </pre>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PostDetailClient;
