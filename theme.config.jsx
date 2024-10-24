export default {
  logo: <span>Jim Chen's Blog</span>,

  head: (
    <>
      <title>Jim Chen's Blog</title>
    </>
  ),
  project: {
    link: "https://github.com/jimchen2/jimchen.me",
  },
  feedback: {
    content: "",
    labels: "feedback",
  },
  editLink: {
    content: "",
  },
  footer: {
    content: (
      <span>
        © {new Date().getFullYear()} <a href="https://github.com/jimchen2">Jim Chen</a>. Built with <a href="https://github.com/shuding/nextra">Nextra</a>.
      </span>
    ),
  },
};
