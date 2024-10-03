"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

interface Blog {
  id?: string;
  slug: string;
  thumbnail: string;
  title: string;
  tags: { value: string; category: string }[];
  content?: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PER_PAGE = 12;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://global-savors-api.onrender.com/api/get_blogs?page=${page}&per_page=${PER_PAGE}`
        );
        if (!response.ok) {
          throw new Error("Error getting all the data");
        }
        const data = await response.json();

        if (data.length < PER_PAGE) {
          setHasMore(false);
        }

        setBlogs(data);
      } catch (error: any) {
        setError(error.message || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    if (page > 1) {
      fetchBlogs();
    } else {
      setLoading(true);
      fetchBlogs();
    }
  }, [page]);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    if (page !== 1) {
      setPage((prev) => prev - 1);
    }
  };
  const colors = [
    {
      bg: "bg-cyan-100",
      fg: "text-cyan-800",
    },
    {
      bg: "bg-yellow-100",
      fg: "text-yellow-800",
    },
    {
      bg: "bg-green-100",
      fg: "text-green-800",
    },
  ];
  console.log(blogs);
  return (
    <div>
      <section className="min-h-[50vh] flex-col flex justify-center items-center text-center space-y-4 max-w-7xl mx-auto">
        <h2 className="text-[62px] font-bold">Blogs</h2>
        <p className="max-w-xl text-lg text-[#666666]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
          expedita aperiam exercitationem.
        </p>
        <div>
          <button className="px-4 py-2 text-white bg-black rounded-md">
            Contact Us
          </button>
        </div>
      </section>

      {loading && (
        <div className="flex items-center justify-center p-4 animate-pulse">
          Loading...
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <>
          <section className="grid grid-cols-1 gap-8 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
            {blogs.map((blog, index) => (
              <Link
                href={`/blogs/${blog.slug.split("/blog/")[1]}`}
                className="space-y-4"
                key={blog.id || index}
              >
                <div className="relative aspect-square rounded-md bg-gray-200 overflow-hidden">
                  {blog.thumbnail ? (
                    <img
                      className="object-cover"
                      src={blog.thumbnail}
                      alt={blog.title || "Blog thumbnail"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-black">No image available</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {blog?.tags?.map((tag) => {
                      return (
                        <span
                          key={tag.value}
                          className={`px-2 truncate text-xs py-1 rounded-full ${
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
                <div>
                  <Markdown className="text-[18px] font-bold">
                    {blog.title}
                  </Markdown>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">{blog.content}</p>
                </div>
              </Link>
            ))}
          </section>
          {hasMore && (
            <div className="flex items-center justify-between py-8 mx-auto max-w-7xl">
              <button
                onClick={previousPage}
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:border-black"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={nextPage}
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:border-black"
              >
                Next
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
      {error && (
        <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-md text-red">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Blogs;
