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
          // Extract the data
          let sortedData = response.data;
          // Convert the date strings to Date objects and then sort them
          sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setData(sortedData);
        } catch (err) {
          // Error handling
        }
      };
      fetchData();
    }
  }, [term]);

  const containerStyle = {
    backgroundColor: colors.color_white,
    color: colors.color_black,
    paddingBottom: "2rem",
    marginTop: "2rem",
    minHeight: "100vh",
  };

  return (
    <div style={containerStyle}>
      <br />
      <br />
      <br />
      {data.map((post, index) => (
        <PreviewCard key={index} title={post.title} text={post.body} date={post.date} type={post.type} bloguuid={post.uuid} language={post.language} searchTerm={term} />
      ))}
      <br />
      <br />{" "}
    </div>
  );
}

export default Search;
