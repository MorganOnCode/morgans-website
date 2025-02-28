import { generateSEOMetadata } from "@/lib/seo";
import ArticleContent from "@/components/blog/ArticleContent";
import { getArticleById, getArticles } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const articles = await getArticles();
  // If no articles are found (possibly due to missing env vars during build),
  // return an empty array to allow the build to complete
  return articles.map((article) => ({ articleId: article.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ articleId: string }>;
}) {
  const params = await props.params;
  const article = await getArticleById(params.articleId);
  if (!article) return notFound();
  return generateSEOMetadata({
    title: `${article.title} | SwiftVoice Blog`,
    description: article.excerpt || "",
  });
}

export default async function ArticlePage(props: {
  params: Promise<{ articleId: string }>;
}) {
  const params = await props.params;
  const article = await getArticleById(params.articleId);
  if (!article) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* @ts-expect-error Server Component */}
      <ArticleContent article={article} />
    </div>
  );
}
