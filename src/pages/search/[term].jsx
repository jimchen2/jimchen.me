import React, { useState, useEffect } from "react";
import axios from "axios";
import PreviewCard from "@/blogpreview/PreviewCard";
import { useRouter } from "next/router";
import { useGlobalColorScheme } from "../../config/global.js";

function Search() {
  const { colors } = useGlobalColorScheme();
  const [data, setData] = useState([]); // Holds the filtered data for display
  const router = useRouter();
  const { term } = router.query; // Get the dynamic parameter from the URL

  useEffect(() => {
    if (term) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/search?query=${term}`);
          let sortedData = response.data;
          sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setData(sortedData);
        } catch (err) {}
      };
      fetchData();
    }
  }, [term]);

  const containerStyle = {
    backgroundColor: colors.color_white,
    color: colors.color_black,
    paddingBottom: "2rem",
    minHeight: "100vh",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <div style={containerStyle}>
      <br />
      <br />
      <br />
      {data.map((post, index) => (
        <PreviewCard key={index} title={post.title} text={post.body} date={post.date} type={post.type} blogid={post.blogid} language={post.language} wordcount={post.word_count} searchTerm={term} />
      ))}
      <br />
      <br />{" "}
    </div>
  );
}

export default Search;
