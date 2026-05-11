'use client'

import { useEffect, useState } from 'react'

/**
 * Sidebar primary navigation.
 *
 * The nav targets (`#chat`, `#about`, `#skills`, `#work`) are fixed
 * anchor IDs declared by section components on the single-page index
 * route, so they intentionally do NOT come from Sanity — they are
 * structural chrome, not editorial content. The legacy site used the
 * same hardcoded list.
 *
 * Active-link highlighting is driven by an IntersectionObserver that
 * watches each section element and promotes the matching nav item
 * when the section crosses the 30% visibility threshold.
 */

interface NavItem {
  name: string
  href: string
  /** id of the section element observed for active-state highlighting. */
  sectionId: string
}

const navItems: readonly NavItem[] = [
  { name: 'AI Chat', href: '#chat', sectionId: 'chat' },
  { name: 'About', href: '#about', sectionId: 'about' },
  { name: 'Skills', href: '#skills', sectionId: 'skills' },
  { name: 'Experience', href: '#work', sectionId: 'work' },
]

const linkBase =
  'group flex items-center gap-4 py-2 text-xs font-bold uppercase tracking-[0.12em] no-underline transition-colors duration-200 ease-out'
const lineBase =
  'inline-block h-px flex-shrink-0 transition-all duration-200 ease-out'

const Header = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState<string>('About')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = navItems.find(
              (item) => item.sectionId === entry.target.id,
            )
            if (matched) setActiveItem(matched.name)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="mt-14 flex flex-col gap-1" aria-label="Primary">
      {navItems.map(({ name, href }) => {
        const isActive = activeItem === name
        const linkClasses = `${linkBase} ${
          isActive ? 'text-sky-200' : 'text-slate-500 hover:text-sky-200'
        }`
        const lineClasses = `${lineBase} ${
          isActive
            ? 'w-16 bg-purple-700'
            : 'w-8 bg-slate-500 group-hover:w-16 group-hover:bg-sky-200'
        }`
        return (
          <a
            key={name}
            href={href}
            className={linkClasses}
            onClick={() => setActiveItem(name)}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className={lineClasses} aria-hidden="true" />
            <span className="text-xs tracking-[0.12em]">{name}</span>
          </a>
        )
      })}
    </nav>
  )
}

export default Header
