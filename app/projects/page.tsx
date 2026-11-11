import CategoryFilter from "../components/CategoryFilter";
import PageHeader from "../components/PageHeader";
import { container } from "../components/styles";
import { projects } from "../data/projects";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  description: "All projects by Pericless: concept art (characters and environments) and illustration.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Portfolio" title="Projects">
        <p>[À REMPLACER] A short introduction to your work: the kind of projects you take on and what ties them together.</p>
      </PageHeader>
      <CategoryFilter projects={projects} />
    </div>
  );
}
