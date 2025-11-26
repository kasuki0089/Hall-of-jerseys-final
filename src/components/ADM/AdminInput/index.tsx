type AdminInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  step?: string;
};

export default function AdminInput({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = true,
  step
}: AdminInputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer bg-transparent"
      />
      <label 
        className={`absolute left-0 top-2 text-sm transition-all pointer-events-none ${
          value 
            ? '-translate-y-6 text-primary font-bold text-xs' 
            : 'text-gray-600 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:font-bold peer-focus:text-xs'
        }`}
      >
        {label}
      </label>
    </div>
  );
}
