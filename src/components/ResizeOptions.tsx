
import React from "react";
import { Sliders, Crop, Ratio, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedButton from "./AnimatedButton";

interface ResizeOptionsProps {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format: "image/jpeg" | "image/png" | "image/webp";
  quality: number;
  onUpdate: (options: any) => void;
  className?: string;
}

const ResizeOptions: React.FC<ResizeOptionsProps> = ({
  width,
  height,
  maintainAspectRatio,
  format,
  quality,
  onUpdate,
  className,
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    onUpdate({ width: newWidth });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    onUpdate({ height: newHeight });
  };

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ maintainAspectRatio: e.target.checked });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ format: e.target.value as any });
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ quality: parseFloat(e.target.value) });
  };

  const formatOptions = [
    { value: "image/jpeg", label: "JPEG" },
    { value: "image/png", label: "PNG" },
    { value: "image/webp", label: "WebP" },
  ];

  const presetSizes = [
    { width: 1200, height: 630, name: "Facebook" },
    { width: 1080, height: 1080, name: "Instagram" },
    { width: 1280, height: 720, name: "Twitter" },
    { width: 1920, height: 1080, name: "Full HD" },
  ];

  const handlePresetClick = (preset: { width: number; height: number }) => {
    onUpdate({ width: preset.width, height: preset.height });
  };

  return (
    <div
      className={cn(
        "bg-card shadow-sm border rounded-xl p-5 space-y-5",
        className
      )}
    >
      <div className="flex items-center space-x-2 pb-3 border-b">
        <Sliders className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Resize Options</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center">
              <Crop className="h-4 w-4 mr-2 text-muted-foreground" />
              Dimensions
            </label>
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={handleAspectRatioChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-2 text-xs font-medium">
                  <Ratio className="h-3 w-3 inline-block mr-1" />
                  Keep ratio
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="width"
                className="block text-xs text-muted-foreground"
              >
                Width (px)
              </label>
              <input
                id="width"
                type="number"
                min="1"
                value={width}
                onChange={handleWidthChange}
                className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="height"
                className="block text-xs text-muted-foreground"
              >
                Height (px)
              </label>
              <input
                id="height"
                type="number"
                min="1"
                value={height}
                onChange={handleHeightChange}
                className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center">
            <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Image Format & Quality
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="format"
                className="block text-xs text-muted-foreground"
              >
                Format
              </label>
              <select
                id="format"
                value={format}
                onChange={handleFormatChange}
                className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="block text-xs text-muted-foreground">
                  Quality
                </span>
                <span className="text-xs font-medium">
                  {Math.round(quality * 100)}%
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={handleQualityChange}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium">Common Presets</label>
          <div className="flex flex-wrap gap-2">
            {presetSizes.map((preset) => (
              <AnimatedButton
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="text-xs"
              >
                {preset.name}
              </AnimatedButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizeOptions;
