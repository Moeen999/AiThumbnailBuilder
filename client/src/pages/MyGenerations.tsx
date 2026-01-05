import { useEffect, useState } from "react";
import SoftBackground from "../components/SoftBackground";
import { dummyThumbnails, type IThumbnail } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";

const MyGenerations = () => {
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const apectRatioMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const fetchThumbnails = async () => {
    setThumbnails(dummyThumbnails as unknown as IThumbnail[]);
    setIsLoading(false);
  };

  const handleDownload = (image_url: string) => {
    window.open(image_url, "_blank");
  };

  const handleDel = (id: string) => {
    console.log(id);
  };

  useEffect(() => {
    fetchThumbnails();
  }, []);

  return (
    <>
      <SoftBackground />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">My Geberations</h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your AI-generated
          </p>
        </div>
        {/* loading?? */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* blank state */}
        {!isLoading && thumbnails.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Generate your first thumbnail to see it here
            </p>
          </div>
        )}

        {/* grid */}
        {!isLoading && thumbnails.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
            {thumbnails.map((thumbnail: IThumbnail) => {
              const aspectClass =
                apectRatioMap[thumbnail.aspect_ratio || "16:9"];
              return (
                <div
                  key={thumbnail._id}
                  onClick={() => navigate(`/generate/${thumbnail._id}`)}
                  className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                >
                  <div
                    className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}
                  >
                    {thumbnail.image_url ? (
                      <img
                        src={thumbnail.image_url}
                        alt={thumbnail.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                        {thumbnail.isGenerating ? "Generating..." : "No Image"}
                      </div>
                    )}
                    {thumbnail.isGenerating && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                        Generating...
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                      {thumbnail.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400 ">
                      <span
                        className={`px-2 py-0.5 rounded bg-white/8 ${thumbnail.style}`}
                      >
                        {thumbnail.style}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded bg-white/8 ${thumbnail.style}`}
                      >
                        {thumbnail.color_scheme}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded bg-white/8 ${thumbnail.style}`}
                      >
                        {thumbnail.aspect_ratio}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {new Date(thumbnail.createdAt!).toDateString()}
                    </p>
                  </div>
                  <div onClick={(e)=>e.stopPropagation()} className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5">
                    <TrashIcon onClick={()=>handleDel(thumbnail._id)} className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                    <DownloadIcon onClick={()=>handleDownload(thumbnail.image_url!)} className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                      <Link target="_blank" to={`/preview?thumbnail_url=${thumbnail.image_url}&title=${thumbnail.title}`}>
                    <ArrowUpRightIcon  className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                      </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGenerations;
