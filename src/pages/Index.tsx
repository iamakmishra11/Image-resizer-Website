
import React from "react";
import ImageResizer from "@/components/ImageResizer";
import { Settings, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full py-6 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Settings className="h-5 w-5 animate-pulse-subtle" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                ImageResizer
              </h1>
              <p className="text-xs text-muted-foreground">
                Resize your images with ease
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="w-full py-10 md:py-16 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none"></div>
        
        {/* Floating elements for design */}
        <div className="absolute top-20 right-[15%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float opacity-60"></div>
        <div className="absolute bottom-10 left-[10%] w-32 h-32 bg-accent/10 rounded-full blur-xl animate-float opacity-40 [animation-delay:1s]"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary mb-4 animate-fade-in">
            Easy Image Resizing
          </div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up",
            "[text-wrap:balance]"
          )}>
            Resize Your Images with 
            <span className="text-primary"> Precision</span>
          </h1>
          
          <p className={cn(
            "text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up [animation-delay:100ms]",
            "[text-wrap:balance]"
          )}>
            Upload multiple images, customize dimensions, and download them all with a single click. 
            Fast, simple, and elegantly designed for the perfect result every time.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up [animation-delay:200ms]">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-background bg-muted [animation-delay:${i * 100}ms] animate-scale-in`}>
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Supports JPG, PNG, WebP</span> and many more formats
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-1 pb-16">
        <ImageResizer />
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 border-t backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">ImageResizer</span>
          </div>
          
          <div className="text-xs text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} ImageResizer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
