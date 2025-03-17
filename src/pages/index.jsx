import React, { useState, useEffect } from "react";
import axios from "axios";
import Blog from "../blogpreview/BlogPreviewPage";

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blogpreview`);
    const previews = response.data.previews || [];
    const postTypes = response.data.postTypes || [];

    return {
      props: {
        initialData: previews,
        initialPostTypes: postTypes,
      },
    };
  } catch (err) {
    console.error("Error fetching blog preview data:", err);
    return {
      props: {
        initialData: [],
        initialPostTypes: [],
      },
    };
  }
}

function BlogPreview({ initialData, initialPostTypes }) {
  // Client-side state still needed for filtering interactions
  const [data] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [postTypes] = useState(initialPostTypes);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Only run filtering logic on client-side
  useEffect(() => {
    if (selectedTypes.length > 0) {
      filterPostsByTypes(selectedTypes);
    }
  }, [selectedTypes]);

  const handleSelectionChange = (selected) => {
    setSelectedTypes(selected);
    filterPostsByTypes(selected);

    const newlySelected = selected.filter((type) => !selectedTypes.includes(type));
    const deselected = selectedTypes.filter((type) => !selected.includes(type));
    const allButtonsSelected = selectedTypes.length === postTypes.length + 1;

    if (newlySelected.includes("all")) {
      setSelectedAndFilter(postTypes.map((t) => t.type).concat("all"));
      return;
    }

    if (deselected.includes("all") && allButtonsSelected) {
      setSelectedAndFilter([]);
      return;
    }

    if (allButtonsSelected) {
      const typesToSet = postTypes.map((t) => t.type).filter((type) => type !== "all" && !deselected.includes(type));
      setSelectedAndFilter(typesToSet);
    }
  };

  const setSelectedAndFilter = (types) => {
    setSelectedTypes(types);
    filterPostsByTypes(types);
  };

  const filterPostsByTypes = (selected) => {
    if (selected.length === 0) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((post) => selected.includes(post.type));
      setFilteredData(filtered);
    }
  };

  const totalPosts = data.length;

  return <Blog data={filteredData} postTypes={postTypes} selectedTypes={selectedTypes} onSelectionChange={handleSelectionChange} totalPosts={totalPosts} />;
}

export default BlogPreview;
