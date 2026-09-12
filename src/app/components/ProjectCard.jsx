"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";

const ProjectCard = ({
  title,
  description,
  imgUrl,
  tags,
  gitUrl,
  preview,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="site-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border site-border"
      onClick={onClick}
    >
      <div
        className="h-56 md:h-64 relative group overflow-hidden"
      >
        {imgUrl ? (
          <Image src={imgUrl} alt={`${title} preview`} fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover" />
        ) : <div className="absolute inset-0 bg-stone-100" />}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-4">
            <Link
              href={gitUrl}
              className="h-16 w-16 border-2 rounded-full border-black hover:border-black bg-[#fffaf1]/90 backdrop-blur-sm hover:bg-[#fffaf1] transition-all duration-200 flex items-center justify-center group/link shadow-lg"
            >
              <CodeBracketIcon className="h-8 w-8 text-black group-hover/link:scale-110 transition-transform duration-200" />
            </Link>

            <div
              onClick={preview}
              className="h-16 w-16 border-2 rounded-full border-black hover:border-black bg-[#fffaf1]/90 backdrop-blur-sm hover:bg-[#fffaf1] transition-all duration-200 flex items-center justify-center group/link cursor-pointer shadow-lg"
            >
              <EyeIcon className="h-8 w-8 text-black group-hover/link:scale-110 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.tag
            .filter((tag) => tag !== "All")
            .map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tag === "Web"
                    ? "site-soft text-gray-600"
                    : tag === "AI/ML"
                      ? "site-soft text-gray-600"
                      : tag === "Game Development"
                        ? "site-soft text-gray-600"
                        : "site-soft text-gray-600"
                }`}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
