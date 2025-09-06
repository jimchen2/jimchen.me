// src/pages/comments.js

import Msg from "@/comment/leaveamessage";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Comments() {
  // Your component remains the same. The magic happens in getStaticProps.
  return <Msg blogid="0" />;
}

// Add this function to the bottom of the file
export async function getStaticProps({ locale }) {
  return {
    props: {
      // This line loads the 'common.json' file for the current language
      // and makes it available to all components on this page.
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}