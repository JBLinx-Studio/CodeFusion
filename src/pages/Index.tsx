
import React from "react";
import { Code, Github, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">CodePlay</h1>
          </div>
          <div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-primary animate-pulse-glow">Code</span>Play
            </h2>
            <p className="text-xl text-foreground/70">
              A minimal playground for your coding projects
            </p>
          </div>
          
          <div className="bg-card border border-border/50 rounded-lg p-6 text-left">
            <pre className="overflow-x-auto">
              <code>
                <span className="text-code-comment">// GitHub Actions deployment ready</span><br />
                <span className="text-code-keyword">const</span> <span className="text-code-variable">project</span> = <span className="text-code-string">"CodePlay"</span>;<br />
                <br />
                <span className="text-code-function">deploy</span>({`{`}<br />
                &nbsp;&nbsp;name: project,<br />
                &nbsp;&nbsp;via: <span className="text-code-string">"GitHub Actions"</span>,<br />
                &nbsp;&nbsp;status: <span className="text-code-string">"ready"</span><br />
                {`}`});
              </code>
            </pre>
          </div>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/80"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Ready to deploy
          </Button>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-4 px-6">
        <div className="container mx-auto text-center text-sm text-foreground/60">
          CodePlay - Deployment ready application
        </div>
      </footer>
    </div>
  );
};

export default Index;
