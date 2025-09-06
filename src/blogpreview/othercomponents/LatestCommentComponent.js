import React from "react";
import Link from "next/link";
import GetComments from "@/comment/getcomments";
import { CommentsProvider } from "@/comment/commentscontext";
import { useTranslation } from "next-i18next"; // 1. Import the translation hook

const Msg = () => {
  const { t } = useTranslation("common"); // 2. Initialize the t function

  return (
    <div style={{ marginLeft: "5%", marginBottom: "5%", marginTop: "5%" }}>
      {/* 3. Use the t function for the title */}
      <div style={{ fontSize: "1rem", fontWeight: "bold" }}>{t("latest-comments-title")}</div>
      <br />
      <CommentsProvider>
        <GetComments blogid="0" showName paddl="0" paddr="0" limit="3" />
      </CommentsProvider>

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <Link href="/comments" style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}>
          {/* 4. Use the t function for the link text */}
          {t("see-all-comments-link")}
        </Link>
      </div>
    </div>
  );
};

export default Msg;
