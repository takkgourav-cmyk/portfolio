import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projectJsonLd } from "@/lib/seo";

export function ProjectPageView({ project }) {
  const Icon = project.icon;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <div className="glass rounded-2xl p-6 shadow-elegant sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{project.category}</span>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{project.overview}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <span key={item} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="gradient-bg text-primary-foreground">
                <a href={project.github} target="_blank" rel="noreferrer">
                  <Github className="mr-1 size-4" />
                  View Code
                </a>
              </Button>
              <Button asChild variant="outline" className="glass">
                <Link href="/#contact">
                  Discuss Project
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            <div className="border-b border-border bg-secondary/60 p-4">
              <div className="flex gap-2">
                <span className="size-3 rounded-full bg-primary/70" />
                <span className="size-3 rounded-full bg-border" />
                <span className="size-3 rounded-full bg-border" />
              </div>
            </div>
            <div className="grid min-h-80 content-between gap-6 p-6">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-8" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Preview</p>
                <h2 className="mt-2 text-2xl font-bold">{project.screens[0]} experience</h2>
                <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {project.screens.map((screen) => (
                  <div key={screen} className="rounded-xl border border-border bg-background p-3 text-sm font-medium">
                    {screen}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="glass rounded-2xl p-5 shadow-elegant">
              <div className="text-3xl font-bold text-primary">{metric.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Requirement</p>
            <h2 className="mt-2 text-2xl font-bold">What this project needed</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.challenge}</p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Solution</p>
            <h2 className="mt-2 text-2xl font-bold">How I built it</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.solution}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Features</p>
            <h2 className="mt-2 text-2xl font-bold">Demo includes</h2>
            <div className="mt-5 grid gap-3">
              {project.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workflow</p>
            <h2 className="mt-2 text-2xl font-bold">Build process</h2>
            <div className="mt-5 grid gap-4">
              {project.process.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="font-semibold">{step}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Step {index + 1} keeps the demo practical, responsive, and easy to extend.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-primary/20 bg-card p-6 shadow-elegant sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Next step</p>
              <h2 className="mt-2 text-2xl font-bold">Want a similar project?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                I can create this kind of responsive website or app UI with your content, brand, and real requirements.
              </p>
            </div>
            <Button asChild className="gradient-bg text-primary-foreground">
              <Link href="/#contact">
                Contact Me
                <ExternalLink className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
