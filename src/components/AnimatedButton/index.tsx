import React from 'react'

interface AnimatedButtonProps {
  title: string
  iconName: string
  onClick: () => void
}

function AnimatedButton({ title, iconName, onClick }: AnimatedButtonProps): JSX.Element {
  return (
    <div className="py-[50px]">
      <button
        type="button"
        onClick={onClick}
        className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded border border-navy-600 bg-navy-600/20 px-6 text-[0.85rem] font-semibold uppercase tracking-wider text-sky-200 transition-colors duration-200 ease-in-out hover:bg-navy-600/40"
      >
        <span className="transition-transform duration-200 ease-in-out group-hover:-translate-y-10">
          {title}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex translate-y-10 items-center justify-center transition-transform duration-200 ease-in-out group-hover:translate-y-0"
        >
          <span className="text-purple-300">{iconName}</span>
        </span>
      </button>
    </div>
  )
}

export default AnimatedButton
