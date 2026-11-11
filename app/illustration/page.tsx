import PageHeader from "../components/PageHeader";
import ProjectGrid from "../components/ProjectGrid";
import { container } from "../components/styles";
import { getProjectsByCategory } from "../data/projects";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Illustration",
  description: "Illustrations by Pericless.",
  path: "/illustration",
});

export default function IllustrationPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Portfolio" title="Illustration">
        <p>
          [À REMPLACER] A short introduction to your illustration work: the stories you tell,
          the clients or projects, and your influences.
        </p>
      </PageHeader>
      <ProjectGrid
        projects={getProjectsByCategory("Illustration")}
        columns={3}
        headingLevel="h2"
        preloadFirst
      />
    </div>
  );
}
