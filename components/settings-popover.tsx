"use client"

import { useSettings } from "@/context/settings-context"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Settings, Sun, Moon, Monitor, Languages } from "lucide-react"

export function SettingsPopover() {
  const { settings, setTheme, setLanguage } = useSettings()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Theme</Label>
            <div className="flex gap-1">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-1 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-1 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={settings.theme === "system" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Language
            </Label>
            <div className="flex gap-1">
              <Button
                variant={settings.language === "en" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
              <Button
                variant={settings.language === "hi" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLanguage("hi")}
              >
                हिंदी
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
