import { useState, useEffect } from "react";
import axios from "axios";
import PreviewCard from "../../blogpreview/PreviewCard";
import { useRouter } from "next/router";
import { useGlobalColorScheme } from "../../config/global";

export default function Search() {
  const { colors } = useGlobalColorScheme();
  const [data, setData] = useState([]);
  const router = useRouter();
  const { term } = router.query;

  useEffect(() => {
    if (term) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/search?query=${term}`);
          let sortedData = response.data;
          sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setData(sortedData);
        } catch (err) {
          setData([]);
        }
      };
      fetchData();
    }
  }, [term]);

  return (
    <div 
      className="min-h-screen pt-8 pb-8"
      style={{ 
        backgroundColor: colors.color_white,
        color: colors.color_black 
      }}
    >
      <div className="space-y-8">
        {data.map((post, index) => (
          <PreviewCard
            key={index}
            title={post.title}
            text={post.body}
            date={post.date}
            type={post.type}
            bloguuid={post.uuid}
            language={post.language}
            searchTerm={term}
          />
        ))}
      </div>
    </div>
  );
}