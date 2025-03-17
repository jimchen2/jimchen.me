import PreviewCard from "./PreviewCard";
import ToggleButtonGroupComponent from "./ToggleButtonGroupComponent";
import { paddingtop, useGlobalColorScheme } from "../config/global";

export default function BlogPreviewPage({ data, postTypes, selectedTypes, onSelectionChange, totalPosts }) {
  const { colors } = useGlobalColorScheme();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1150px] mx-auto px-5 pb-8">
        <ToggleButtonGroupComponent selectedTypes={selectedTypes} onSelectionChange={onSelectionChange} postTypes={postTypes} totalPosts={totalPosts} colors={colors} paddingtop={paddingtop} />
        <div className="mt-8 space-y-8">
          {data.map((post, index) => (
            <PreviewCard key={index} title={post.title} text={post.body} date={post.date} type={post.type} language={post.language} />
          ))}
        </div>
        <div className="h-[5rem]" />
      </div>
    </div>
  );
}
