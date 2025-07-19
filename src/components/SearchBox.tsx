interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  
  export function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
        placeholder={placeholder || "Search..."}
      />
    );
  }