"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
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
      } catch (error) {
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
                <img
                  className="object-cover rounded-md"
                  src={blog.thumbnail}
                  alt={blog.title || "Blog thumbnail"}
                />
                <div>
                  <span
                    className={`px-4 py-2 text-xs font-semibold rounded-full ${
                      colors[index % 3].bg
                    } ${colors[index % 3].fg}`}
                  >
                    {blog.tags[0].value}
                  </span>
                </div>
                <div>
                  <Markdown className="text-[18px] font-bold">
                    {blog.title}
                  </Markdown>
                </div>
                <div>
                  <Markdown className="text-sm text-[#666666]">
                    {blog.content?.split("\n\n")?.slice(1, 2)?.join("\n\n")}
                  </Markdown>
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
