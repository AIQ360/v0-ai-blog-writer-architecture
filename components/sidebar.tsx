"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Layers, Tag, Send, Settings, HelpCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AuthStatus from "./auth-status"
import { useSession } from "next-auth/react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const navItems = [
    { name: "Articles", href: "/articles", icon: <Zap className="h-5 w-5" /> },
    { name: "Patterns", href: "/patterns", icon: <Layers className="h-5 w-5" /> },
    { name: "Keywords", href: "/keywords", icon: <Tag className="h-5 w-5" /> },
    { name: "Publishing", href: "/publishing", icon: <Send className="h-5 w-5" /> },
  ]

  const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
    { name: "Support", href: "/support", icon: <HelpCircle className="h-5 w-5" /> },
  ]

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-red-500 text-xl">AI Blog Writer</span>
        </Link>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname.startsWith(item.href)
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 mt-auto">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname.startsWith(item.href)
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 p-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <AuthStatus />
            {session && (
              <div className="text-xs text-gray-500">
                <div>Free Plan</div>
                <div>1/3 Articles</div>
              </div>
            )}
          </div>
          {session && (
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Upgrade plan
            </Button>
          )}
        </div>
      </div>
    </>
  )

  // Mobile sidebar with Sheet component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return (
    <div className="hidden md:flex w-48 bg-white border-r flex-col h-full">
      <SidebarContent />
    </div>
  )
}
