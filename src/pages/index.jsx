"use client"; 

import React, { useState, useEffect } from "react";
import axios from "axios";
import Blog from "../blogpreview/BlogPreviewPage"; // Import the presentational component

function BlogPreview() {
  const [data, setData] = useState([]); // Initialize with empty array
  const [filteredData, setFilteredData] = useState([]); // Initialize with empty array
  const [postTypes, setPostTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/blogpreview`);
        if (response.data && response.data.previews) {
          setData(response.data.previews);
          setFilteredData(response.data.previews);
        }
        if (response.data && response.data.postTypes) {
          setPostTypes(response.data.postTypes);
        }
        setSelectedTypes([]);
      } catch (err) {
        setData([]);
        setFilteredData([]);
        setPostTypes([]);
      }
    };

    fetchData();
  }, []);

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
    const filtered = data.filter((post) => selected.includes(post.type));
    setFilteredData(filtered);
  };
  
  const totalPosts = data.length;
  console.log(totalPosts);

  return (
    <Blog
      data={filteredData}
      postTypes={postTypes}
      selectedTypes={selectedTypes}
      onSelectionChange={handleSelectionChange}
      totalPosts={totalPosts}
    />
  );
}

export default BlogPreview;