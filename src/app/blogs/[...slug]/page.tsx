"use client";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";
import Link from "next/link";
import retailSvg from "../../../../public/svg/retail.svg";
import wholesaleSvg from "../../../../public/svg/wholesale.svg";

// Add these type definitions at the top of your file
interface Tag {
  value: string;
  category: string;
}

interface SuggestedBlog {
  id?: string;
  slug: string;
  thumbnail: string;
  title: string;
  preview?: string;
}

interface CTA {
  title: string;
  retail_url?: string;
  wholesale_url: string;
}

interface Blog {
  thumbnail: string;
  content: string;
  tags?: Tag[];
  faq?: string;
  suggested?: SuggestedBlog[];
  cta?: CTA;
}

const BlogPage = () => {
  const url = "https://globalsavors.com/blog/";
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { slug }: { slug: string[] } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://global-savors-api.onrender.com/api/get_single_blog",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: url + slug.join("/"),
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching single response.");
        }
        const data = await response.json();
        setBlog(data[0]);
        console.log("fetched");
      } catch (error: any) {
        console.error(error.message || "error fetching data");
      }
    };

    fetchBlog().then(() => {
      setLoading(false);
    });
  }, [slug, url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 animate-pulse">
        Loading...
      </div>
    );
  }
  console.log(blog);
  return (
    <div>
      <section className="grid min-h-screen grid-cols-1 gap-4 space-y-6 md:grid-cols-2">
        <div className="h-[100%] px-4">
          <img
            className="object-cover w-full h-full rounded-md"
            src={blog?.thumbnail}
            alt=""
          />
        </div>
        <div className="flex-1 h-[90%] flex px-4 items-center justify-center flex-col">
          <div className="space-y-4">
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="md:text-[48px] font-bold sm:text-[42px] text-[36px]">
                    {children}
                  </h1>
                ),
              }}
              className="space-y-4"
            >
              {blog?.content?.split("\n\n")?.slice(0, 2).join("\n\n")}
            </Markdown>
            <div className="flex flex-wrap items-center gap-2">
              {blog?.tags?.map((tag, idx) => {
                return (
                  <span
                    key={tag.value}
                    className={`px-4 text-sm py-2 rounded-full ${
                      tag.category === "product"
                        ? "bg-cyan-100 text-cyan-700"
                        : tag.category === "product_group"
                        ? "bg-green-100 text-green-700"
                        : tag.category === "type"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }`}
                  >
                    {tag?.value}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="px-8 py-10 mx-auto space-y-4 max-w-7xl">
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="space-y-4"
          components={{
            h2: ({ children }) => (
              <div className="flex items-center gap-4">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                  {children}
                </h2>
              </div>
            ),
            h3: ({ children }) => <h3 className="font-semibold">{children}</h3>,
            p: ({ children }) => <p>{children}</p>,
            li: ({ children }) => (
              <div className="flex flex-wrap items-center gap-2">
                {children}
              </div>
            ),
            ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
          }}
        >
          {blog?.content?.split("\n\n")?.slice(2).join("\n\n")}
        </Markdown>
        <div className="h-12"></div>
        <Markdown
          components={{
            h1: ({ children }) => <h1 className="">{children}</h1>,
            h3: ({ children }) => (
              <div>
                {" "}
                <h2 className="mb-6 text-3xl font-bold">{children}</h2>
              </div>
            ),
            p: ({ children }) => (
              <div className="flex flex-col gap-6 md:items-center md:flex-row">
                <div>
                  <div className="inline-flex p-2 text-gray-600 bg-gray-100 rounded-md">
                    {" "}
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18 6C11.3726 6 6 11.3726 6 18C6 24.6274 11.3726 30 18 30C24.6274 30 30 24.6274 30 18C30 11.3726 24.6274 6 18 6ZM3 18C3 9.71573 9.71573 3 18 3C26.2843 3 33 9.71573 33 18C33 26.2843 26.2843 33 18 33C9.71573 33 3 26.2843 3 18ZM18 11.7C16.2784 11.7 15 12.9784 15 14.7C15 15.5284 14.3284 16.2 13.5 16.2C12.6716 16.2 12 15.5284 12 14.7C12 11.3216 14.6216 8.7 18 8.7C21.3784 8.7 24 11.3216 24 14.7C24 17.5582 22.1236 19.8747 19.5 20.5203V20.55C19.5 21.3784 18.8284 22.05 18 22.05C17.1716 22.05 16.5 21.3784 16.5 20.55V19.2C16.5 18.3716 17.1716 17.7 18 17.7C19.7216 17.7 21 16.4216 21 14.7C21 12.9784 19.7216 11.7 18 11.7ZM18 22.95C18.8284 22.95 19.5 23.6216 19.5 24.45V25.8C19.5 26.6284 18.8284 27.3 18 27.3C17.1716 27.3 16.5 26.6284 16.5 25.8V24.45C16.5 23.6216 17.1716 22.95 18 22.95Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-black p:text-sm p:text-[#666666] h1:font-semibold h-1:text-lg">
                  {children}
                </div>
              </div>
            ),
          }}
          remarkPlugins={[remarkGfm]}
          className="space-y-4 "
        >
          {blog?.faq}
        </Markdown>
      </section>
      <section className="py-16 mx-auto space-y-8 max-w-7xl">
        <h2 className="text-[32px] font-bold leading-[40px]">
          Read more articles
        </h2>
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
          {blog?.suggested?.map((blog, index) => (
            <Link
              href={`/blogs/${blog.slug.split("/blog/")[1]}`}
              className="space-y-4"
              key={blog.id || index}
            >
              <img
                className="object-cover rounded-md"
                src={blog.thumbnail}
                alt={blog.title || "Blog thumbnail"}
              />
              <div className="space-y-3">
                <Markdown className="text-[18px] font-bold">
                  {blog.title}
                </Markdown>
                <p className="text-sm text-[#666666]">{blog?.preview}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="min-h-[60vh] max-w-6xl mx-auto gap-12 flex flex-col items-center justify-center">
        <div>
          <h2 className="max-w-md text-[40px] font-bold text-center">
            {blog?.cta?.title}
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 md:grid-cols-2">
          {blog?.cta?.retail_url && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <img className="w-56 h-56" src={retailSvg.src} alt="" />
              <a
                href={blog?.cta?.retail_url}
                className="px-12 hover:bg-[#17A2B8] hover:text-white py-2 text-sm rounded-md border-2 font-semibold border-[#17A2B8] text-[#17A2B8]"
              >
                Shop Retail
              </a>
            </div>
          )}
          <div className="flex flex-col items-center justify-center space-y-4">
            <img className="w-56 h-56" src={wholesaleSvg.src} alt="" />
            <a
              href={blog?.cta?.wholesale_url}
              className="px-12 hover:bg-[#17A2B8] hover:text-white py-2 text-sm rounded-md border-2 font-semibold border-[#17A2B8] text-[#17A2B8]"
            >
              Get Wholesale pricing
            </a>
            <small className="text-xs text-[#666666]">
              Reduce ingredient costs by 5-10%
            </small>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
