import BlogPage, { getServerSideProps as getBlogPageServerSideProps } from './page/[page]';

export async function getServerSideProps(context) {
  return getBlogPageServerSideProps({ ...context, params: { page: '1' } });
}

export default BlogPage;  