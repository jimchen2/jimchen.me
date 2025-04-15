// cron/refresh-redis.js
import Blog from "@/backend_utils/models/blog.model";
import { initializeRedis } from "@/backend_utils/db/redis";
import dbConnect from "@/backend_utils/db/mongoose";

export async function fetchBlogPreviews(start, count, type = null, sort = 'date_latest') {
  let query = {};
  if (type) {
    query.type = type;
  }

  // Define sort criteria
  let sortCriteria = {};
  switch (sort) {
    case 'date_oldest':
      sortCriteria = { date: 1 };
      break;
    case 'most_words':
      sortCriteria = { word_count: -1 }; 
      break;
    case 'least_words':
      sortCriteria = { word_count: 1 };
      break;
    default:
      sortCriteria = { date: -1 }; 
  }

  const blogs = await Blog.find(query)
    .sort(sortCriteria)
    .skip(start)
    .limit(count)
    .collation({ locale: "en_US", numericOrdering: true });

  const previewPromises = blogs.map((blog) => processBlog(blog));
  return Promise.all(previewPromises);
}

export async function processBlog(blog) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return {
    ...blog.toObject(),
    body: blog.body.substring(0, 200),
    date: formattedDate,
  };
}

export async function calculateCountAndCachePagination(count = 10, type = null) {
  const client = await initializeRedis();
  let totalBlogs = 0;
  let totalPages = 0;

  if (type) {
    totalBlogs = await Blog.countDocuments({ type });
    totalPages = Math.ceil(totalBlogs / count);
  } else {
    totalBlogs = await Blog.countDocuments();
    totalPages = Math.ceil(totalBlogs / count);
  }

  if (client) {
    if (type) {
      await client.setEx(`blog_total_pages_type_${type}`, 365 * 24 * 60 * 60, totalPages.toString());
      await client.setEx(`blog_total_count_type_${type}`, 365 * 24 * 60 * 60, totalBlogs.toString());
    } else {
      await client.setEx("blog_total_pages", 365 * 24 * 60 * 60, totalPages.toString());
      await client.setEx("blog_total_count", 365 * 24 * 60 * 60, totalBlogs.toString());
    }

    if (!type) {
      const blogTypes = await Blog.distinct("type");
      await client.setEx("blog_types", 365 * 24 * 60 * 60, JSON.stringify(blogTypes));

      for (const type of blogTypes) {
        const typeCount = await Blog.countDocuments({ type });
        const typePages = Math.ceil(typeCount / count);

        await client.setEx(`blog_total_pages_type_${type}`, 365 * 24 * 60 * 60, typePages.toString());
        await client.setEx(`blog_total_count_type_${type}`, 365 * 24 * 60 * 60, typeCount.toString());
      }
    }
  }

  return { totalBlogs, totalPages };
}

async function refreshCacheInBackground(start, count, type = null, sort = 'date_latest') {
  const cacheKey = type 
    ? `blog_previews:sort=${sort}&start=${start}&count=${count}&type=${type}`
    : `blog_previews:sort=${sort}&start=${start}&count=${count}`;

  try {
    const client = await initializeRedis();
    if (!client) return;

    const previews = await fetchBlogPreviews(start, count, type, sort);
    await client.setEx(cacheKey, 365 * 24 * 60 * 60, JSON.stringify(previews));
  } catch (err) {
    console.error(`Error refreshing cache for ${cacheKey}:`, err);
  }
}

export default async function refreshBlogsCron(req, res) {
  await dbConnect();

  try {
    const { totalBlogs, _ } = await calculateCountAndCachePagination();
    console.log(`Total blog previews to cache: ${totalBlogs}`);

    const blogsPerPage = 10;
    const refreshPromises = [];
    const sortOptions = ['date_oldest', 'date_latest', 'most_words', 'least_words'];

    // Cache all blogs for each sort option
    for (const sort of sortOptions) {
      for (let start = 0; start < totalBlogs; start += blogsPerPage) {
        refreshPromises.push(refreshCacheInBackground(start, blogsPerPage, null, sort));
      }
    }

    const blogTypes = await Blog.distinct("type");

    // Cache each type with each sort option
    for (const type of blogTypes) {
      const typeCount = await Blog.countDocuments({ type });

      for (const sort of sortOptions) {
        for (let start = 0; start < typeCount; start += blogsPerPage) {
          refreshPromises.push(refreshCacheInBackground(start, blogsPerPage, type, sort));
        }
      }
    }

    const client = await initializeRedis();
    if (client) {
      const typesWithCounts = await Promise.all(
        blogTypes.map(async (type) => {
          const count = await Blog.countDocuments({ type });
          return { type, count };
        })
      );
      await client.setEx("blog_types_with_counts", 365 * 24 * 60 * 60, JSON.stringify(typesWithCounts));
    }

    await Promise.all(refreshPromises);

    res.status(200).json({
      message: "Blog cache refresh completed",
    });
  } catch (err) {
    console.error("Error in cron job:", err);
    res.status(500).json({ message: "Error in cron job", error: err.message });
  }
}