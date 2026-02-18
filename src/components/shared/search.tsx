'use client'

import { Input } from "@/components/ui/input"

export default function SearchComponent({ handleSearch }: { handleSearch: (searchTerm: string) => void }) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          onChange={handleInputChange}
          placeholder="Search Member"
          className="w-full pl-10 pr-4 py-2 rounded-none border-none text-foreground placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:cursor-pointer"
        />
      </div>
    </div>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}