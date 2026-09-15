// Icon names are looked up from react-icons (Simple Icons, with a few Font Awesome / VS
// Code icons for brands Simple Icons doesn't have) at render time. Sourced from
// Jason_Lin_Resume.pdf and Jason's self-reported skills list. A handful of real skills
// (OpenAI, IBM, COBOL, Pinecone, Machine Learning, Neural Networks, Mask R-CNN, ResNet-50,
// and general concepts like "CI/CD" or "Agile Development") have no accurate brand icon
// available in any of these sets, so they're left out of this visual rather than shown
// with a wrong/misleading logo or a generic placeholder.
const skillsData = {
  frontend: [
    { name: "JavaScript", iconName: "SiJavascript", color: "#F7DF1E" },
    { name: "TypeScript", iconName: "SiTypescript", color: "#3178C6" },
    { name: "React", iconName: "SiReact", color: "#61DAFB" },
    { name: "Next.js", iconName: "SiNextdotjs", color: "#362c27" },
    { name: "Tailwind CSS", iconName: "SiTailwindcss", color: "#38BDF8" },
    { name: "Axios", iconName: "SiAxios", color: "#5A29E4" },
    { name: "HTML", iconName: "SiHtml5", color: "#E34F26" },
  ],
  backend: [
    { name: "Python", iconName: "SiPython", color: "#3776AB" },
    { name: "PyTorch", iconName: "SiPytorch", color: "#EE4C2C" },
    { name: "Go", iconName: "SiGo", color: "#00ADD8" },
    { name: "FastAPI", iconName: "SiFastapi", color: "#009688" },
    { name: "Socket.io", iconName: "SiSocketdotio", color: "#362c27" },
    { name: "JWT", iconName: "SiJsonwebtokens", color: "#000000" },
    { name: "Flask", iconName: "SiFlask", color: "#362c27" },
    { name: "Node.js", iconName: "SiNodedotjs", color: "#5FA04E" },
    { name: "LangChain", iconName: "SiLangchain", color: "#1C3C3C" },
    { name: "OpenCV", iconName: "SiOpencv", color: "#5C3EE8" },
    { name: "Java", iconName: "FaJava", color: "#EA2D2E" },
    { name: "C++", iconName: "SiCplusplus", color: "#00599C" },
  ],
  database: [
    { name: "PostgreSQL", iconName: "SiPostgresql", color: "#4169E1" },
    { name: "MongoDB", iconName: "SiMongodb", color: "#47A248" },
    { name: "Redis", iconName: "SiRedis", color: "#DC382D" },
    { name: "SQLite", iconName: "SiSqlite", color: "#003B57" },
  ],
  devops: [
    { name: "Git", iconName: "SiGit", color: "#F05032" },
    { name: "GitHub", iconName: "SiGithub", color: "#362c27" },
    { name: "GitHub Actions", iconName: "SiGithubactions", color: "#2088FF" },
    { name: "Vercel", iconName: "SiVercel", color: "#362c27" },
    { name: "Docker", iconName: "SiDocker", color: "#2496ED" },
    { name: "Kubernetes", iconName: "SiKubernetes", color: "#326CE5" },
    { name: "AWS", iconName: "FaAws", color: "#FF9900" },
    { name: "Postman", iconName: "SiPostman", color: "#FF6C37" },
    { name: "VS Code", iconName: "VscVscode", color: "#007ACC" },
  ],
};

export default skillsData;
