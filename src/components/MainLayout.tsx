
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Globe, 
  Clock, 
  Settings as SettingsIcon,
  Users,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Header from '@/components/Header'
import CountryBlocking from '@/pages/CountryBlocking'
import TimeRestrictions from '@/pages/TimeRestrictions'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import AffiliateExceptions from '@/pages/AffiliateExceptions'

const navItems = [
  {
    title: 'Country Blocking',
    href: '/admin/country-blocking',
    icon: Globe
  },
  {
    title: 'Time Restrictions',
    href: '/admin/time-restrictions',
    icon: Clock
  },
  {
    title: 'Affiliate Exceptions',
    href: '/admin/affiliate-exceptions',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: SettingsIcon
  }
]

const MainLayout = () => {
  const location = useLocation()
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            <div className="mb-4">
              <Link 
                to="/admin"
                className={cn(
                  "flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-md",
                  location.pathname === '/admin' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
            <nav className="grid items-start gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-md",
                    location.pathname === item.href 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        
        <main className="flex w-full flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<CountryBlocking />} />
            <Route path="/country-blocking" element={<CountryBlocking />} />
            <Route path="/time-restrictions" element={<TimeRestrictions />} />
            <Route path="/affiliate-exceptions" element={<AffiliateExceptions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
